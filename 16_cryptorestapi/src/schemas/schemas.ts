import {
    int,
    text,
    mysqlTable,
    float
  } from 'drizzle-orm/mysql-core';

export const exchanges = mysqlTable('exchange', {
    currency: text('currency').notNull(),
    kucoin: float('kucoin').notNull(),
    coinStats: float('coinStats').notNull(),
    coinBase: float('coinBase').notNull(),
    coinPaprika: float('coinPaprika').notNull(),
    time: int('time').notNull()
  });

export type markets = "kucoin" | "coinStats" | "coinBase" | "coinPaprika"