/* eslint-disable perfectionist/sort-imports */
import 'reflect-metadata'
import 'core-js'

import orderRoutes from '@app/routes/order.routes'
import productRoutes from '@app/routes/product.routes'
import userRoutes from '@app/routes/user.routes'

import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'
import { showRoutes } from 'hono/dev'
import cartRoutes from './application/routes/cart.routes'

const app = new OpenAPIHono()

app.get('/health', (ctx) => {
  return ctx.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

app.doc('/docs', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Z1 - Ecommerce API',
  },
})

app.get('/ui', swaggerUI({ url: '/docs' }))

app.route('/users', userRoutes)
app.route('/products', productRoutes)
app.route('/orders', orderRoutes)
app.route('/carts', cartRoutes)

showRoutes(app)

export default app
