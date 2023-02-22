import {
    int,
    text,
    mysqlTable,
  } from 'drizzle-orm/mysql-core';

export const exchanges = mysqlTable('exchanges', {
    currency: text('currency').notNull(),
    kucoin: int('kucoin').notNull(),
    coinStats: int('coinStats').notNull(),
    coinBase: int('coinBase').notNull(),
    coinPaprika: int('coinPaprika').notNull(),
    time: int('time').notNull()
  });

export type markets = "kucoin" | "coinStats" | "coinBase" | "coinPaprika"