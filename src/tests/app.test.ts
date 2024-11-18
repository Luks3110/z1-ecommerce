import app from '@/main'

import { beforeAll } from 'bun:test'

beforeAll(() => app.mount('/', () => null as any))
