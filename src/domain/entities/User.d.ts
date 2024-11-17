import { users } from "@/infrastructure/database/schema/users";

type User = typeof users.$inferSelect

type NewUser = typeof users.$inferInsert

export type { NewUser, User };
