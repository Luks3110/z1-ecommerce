import type {
  CreateOrderData,
  Order,
  OrderItem,
} from '@/domain/entities/Order'
import type { IOrderRepository } from '@/domain/repositories/IOrderRepository'
import type { ResultTuple } from '@/domain/utils/result'
import { Result } from '@/domain/utils/result'
import Database from '@/infrastructure/database/db'
import { eq, inArray, sql } from 'drizzle-orm'
import { inject, injectable } from 'tsyringe'
import { orderItems } from '../database/schema/order_items'
import { orders } from '../database/schema/orders'
import { products } from '../database/schema/products'

@injectable()
export class OrderRepository implements IOrderRepository {
  constructor(
    @inject(Database.name)
    private db: Database,
  ) {}

  async create(
    orderData: CreateOrderData,
  ): Promise<ResultTuple<Order & { items: OrderItem[] }>> {
    const db = this.db.drizzle()

    try {
      return await db.transaction(
        async (tx) => {
          const result = await tx.execute(sql`
                    WITH product_validation AS (
                        SELECT 
                            p.id,
                            p.price,
                            p.stock,
                            p.is_available,
                            q.quantity
                        FROM (
                            SELECT 
                                unnest(ARRAY[${sql.join(
                                  orderData.items.map(item => item.productId),
                                  sql`,`,
                                )}]::int[]) as product_id,
                                unnest(ARRAY[${sql.join(
                                  orderData.items.map(item => item.quantity),
                                  sql`,`,
                                )}]::int[]) as quantity
                        ) q
                        JOIN ${products} p ON p.id = q.product_id
                        WHERE p.is_available = true AND p.stock >= q.quantity
                    ),
                    validation_check AS (
                        SELECT COUNT(*) = ${orderData.items.length} as is_valid
                        FROM product_validation
                    ),
                    new_order AS (
                        INSERT INTO ${orders} (user_id, total_price)
                        SELECT 
                            ${orderData.userId},
                            (SELECT SUM(price * quantity) FROM product_validation)
                        WHERE (SELECT is_valid FROM validation_check)
                        RETURNING *
                    ),
                    new_order_items AS (
                        INSERT INTO ${orderItems} (order_id, product_id, quantity, price_at_time)
                        SELECT 
                            (SELECT id FROM new_order),
                            pv.id,
                            pv.quantity,
                            pv.price
                        FROM product_validation pv
                        WHERE EXISTS (SELECT 1 FROM new_order)
                        RETURNING *
                    ),
                    update_products AS (
                        UPDATE ${products} p
                        SET 
                            stock = p.stock - pv.quantity,
                            is_available = CASE 
                                WHEN (p.stock - pv.quantity) <= 0 THEN false 
                                ELSE p.is_available 
                            END,
                            updated_at = now()
                        FROM product_validation pv
                        WHERE p.id = pv.id
                        AND EXISTS (SELECT 1 FROM new_order)
                    )
                    SELECT 
                        new_order.*,
                        COALESCE(json_agg(new_order_items.*) FILTER (WHERE new_order_items.id IS NOT NULL), '[]') as items
                    FROM new_order
                    LEFT JOIN new_order_items ON new_order_items.order_id = new_order.id
                    GROUP BY new_order.id, new_order.user_id, new_order.total_price, new_order.created_at, new_order.updated_at;
                `)

          if (!result.rows[0]) {
            return Result.error({
              name: 'ValidationError',
              message:
                'One or more products are unavailable or have insufficient stock',
              source: 'OrderRepository.create',
            })
          }

          const { items, ...order } = result.rows[0] as unknown as Order & {
            items: OrderItem[]
          }
          return Result.ok({ ...order, items })
        },
        {
          isolationLevel: 'serializable',
        },
      )
    }
    catch (error: any) {
      return Result.error({
        name: 'DatabaseError',
        message: 'Error creating order',
        source: 'OrderRepository.create',
        originalErrorObject: error,
      })
    }
  }

  async findById(
    id: number,
  ): Promise<ResultTuple<Order & { items: OrderItem[] }>> {
    try {
      const [order] = await this.db
        .drizzle()
        .select()
        .from(orders)
        .where(eq(orders.id, id))

      if (!order || !order.userId) {
        return Result.error({
          name: 'NotFoundError',
          message: `Order with id ${id} not found`,
          source: 'OrderRepository.findById',
        })
      }

      const foundOrderItems = await this.db
        .drizzle()
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, id))

      return Result.ok({
        ...order,
        userId: order.userId,
        items: foundOrderItems,
      })
    }
    catch {
      return Result.error({
        name: 'DatabaseError',
        message: 'Error finding order',
        source: 'OrderRepository.findById',
      })
    }
  }

  async findAll(): Promise<ResultTuple<Array<Order & { items: OrderItem[] }>>> {
    try {
      const allOrders = await this.db.drizzle()
        .select()
        .from(orders)
        .where(sql`${orders.userId} IS NOT NULL`)

      const allOrderItems = await this.db
        .drizzle()
        .select()
        .from(orderItems)
        .where(
          inArray(
            orderItems.orderId,
            allOrders.map(order => order.id),
          ),
        )

      const itemsByOrder = allOrderItems.reduce(
        (acc, item) => {
          if (!acc[item.orderId]) {
            acc[item.orderId] = []
          }
          acc[item.orderId].push(item)
          return acc
        },
        {} as Record<number, OrderItem[]>,
      )

      const ordersWithItems = allOrders.map(order => ({
        ...order,
        userId: order.userId!,
        items: itemsByOrder[order.id] || [],
      }))

      return Result.ok(ordersWithItems)
    }
    catch {
      return Result.error({
        name: 'DatabaseError',
        message: 'Error fetching orders',
        source: 'OrderRepository.findAll',
      })
    }
  }

  async findByUserId(
    userId: number,
  ): Promise<ResultTuple<Array<Order & { items: OrderItem[] }>>> {
    try {
      const userOrders = await this.db
        .drizzle()
        .select()
        .from(orders)
        .where(eq(orders.userId, userId))

      if (!userOrders.length) {
        return Result.ok([])
      }

      const foundOrderItems = await this.db
        .drizzle()
        .select()
        .from(orderItems)
        .where(
          inArray(
            orderItems.orderId,
            userOrders.map(order => order.id),
          ),
        )

      const itemsByOrder = foundOrderItems.reduce(
        (acc, item) => {
          if (!acc[item.orderId]) {
            acc[item.orderId] = []
          }
          acc[item.orderId].push(item)
          return acc
        },
        {} as Record<number, OrderItem[]>,
      )

      const ordersWithItems = userOrders
        .filter(order => order.userId !== null)
        .map(order => ({
          ...order,
          userId: order.userId as number,
          items: itemsByOrder[order.id] || [],
        }))

      return Result.ok(ordersWithItems)
    }
    catch {
      return Result.error({
        name: 'DatabaseError',
        message: 'Error fetching user orders',
        source: 'OrderRepository.findByUserId',
      })
    }
  }

  async delete(id: number): Promise<ResultTuple<void>> {
    const db = this.db.drizzle()

    try {
      return await db.transaction(async (tx) => {
        const [order] = await tx.select().from(orders).where(eq(orders.id, id))

        if (!order) {
          return Result.error({
            name: 'NotFoundError',
            message: `Order with id ${id} not found`,
            source: 'OrderRepository.delete',
          })
        }

        await tx.delete(orderItems).where(eq(orderItems.orderId, id))

        await tx.delete(orders).where(eq(orders.id, id))

        return Result.ok(void 0)
      })
    }
    catch {
      return Result.error({
        name: 'DatabaseError',
        message: 'Error deleting order',
        source: 'OrderRepository.delete',
      })
    }
  }
}
