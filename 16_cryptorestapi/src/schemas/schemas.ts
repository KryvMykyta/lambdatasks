import {
    text,
    doublePrecision,
    pgTable,
    bigint
  } from 'drizzle-orm/pg-core';

export const exchanges = pgTable('exchange', {
    currency: text('currency').notNull(),
    kucoin: doublePrecision('kucoin').notNull(),
    coinStats: doublePrecision('coinStats').notNull(),
    coinBase: doublePrecision('coinBase').notNull(),
    coinPaprika: doublePrecision('coinPaprika').notNull(),
    time: bigint('time',{mode: 'number'}).notNull()
  });

export type markets = "kucoin" | "coinStats" | "coinBase" | "coinPaprika"