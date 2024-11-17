import { products } from "@/infrastructure/database/schema/products"

type Product = typeof products.$inferSelect
type NewProduct = typeof products.$inferInsert

export type { NewProduct, Product }

