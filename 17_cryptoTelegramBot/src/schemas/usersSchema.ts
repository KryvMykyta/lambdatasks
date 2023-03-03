import { sqliteTable, text, integer} from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
    id: integer('userId').primaryKey().notNull(),
    favourite: text('favourite').notNull(),
    lastViewed: text('lastViewed').notNull(),
  }
);