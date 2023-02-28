import {
  addKeyboardOptions,
  deleteKeyboardOptions,
} from "./../keyboards/keyboards";
import { getMessageOfCoinsList } from "./getCryptoData";

const sqlite3 = require("sqlite3").verbose();

const DB_PATH = `./usersDb.db`

type userData = { favourite: string; userId: number; lastViewed: string };

export const sendFavourite = async (
  id: number,
  callback: (str: string) => void
) => {
  const sql = `SELECT * FROM users WHERE userId = ${id}`;
  const db = new sqlite3.Database(DB_PATH);
  await db.get(sql, async (err: Error, userData: userData) => {
    if (err) {
      console.log(err);
    }
    if (!userData.favourite) {
      callback("You have empty list of favourites");
      return 0;
    }
    const data = await getMessageOfCoinsList(userData.favourite.split(","));
    callback(data);
  });
  db.close();
}

export const addToFavourite = async (id: number, coinSymbol: string) => {
  const sql = `SELECT * FROM users WHERE userId = ${id}`;
  const db = new sqlite3.Database(DB_PATH);
  await db.get(sql, async (err: Error, userData: userData) => {
    if (err) {
      console.log(err);
    }
    if (!userData.favourite) {
      await db.run(
        `UPDATE users SET favourite = "${coinSymbol}" WHERE userId = ${id}`
      );
      return 0;
    }
    const favourite = userData.favourite.split(",");
    if (!favourite.includes(coinSymbol)) {
      favourite.push(coinSymbol);
    }
    const newFavourite = favourite.join(",");
    await db.run(
      `UPDATE users SET favourite = "${newFavourite}" WHERE userId = ${id}`
    );
  });
  db.close();
}

export const checkInFavourite = async (
  id: number,
  coinSymbol: string,
  callback: (keyboard: any) => void,
  msgid: number
) => {
  const sql = `SELECT * FROM users WHERE userId = ${id}`;
  const db = new sqlite3.Database(DB_PATH);
  await db.get(sql, async (err: Error, userData: userData) => {
    if (err) {
      console.log(err);
    }
    console.log(userData)
    const favourite = userData.favourite.split(",");
    const exists = favourite.includes(coinSymbol);
    if (exists) {
      callback(deleteKeyboardOptions(msgid));
    } else {
      callback(addKeyboardOptions(msgid));
    }
  });
  db.close();
}

export const addLastViewed = async (id: number) => {
  const sql = `SELECT * FROM users WHERE userId = ${id}`;
  const db = new sqlite3.Database(DB_PATH);
  await db.get(sql, async (err: Error, userData: userData) => {
    if (err) {
      console.log(err);
    }
    const lastViewed = userData.lastViewed;
    if (lastViewed.length > 2 && lastViewed.length < 6) {
      await addToFavourite(id, lastViewed);
    }
  });
  db.close();
}

export const deleteLastViewed = async (id: number) => {
  const sql = `SELECT * FROM users WHERE userId = ${id}`;
  const db = new sqlite3.Database(DB_PATH);
  await db.get(sql, async (err: Error, userData: userData) => {
    if (err) {
      console.log(err);
    }
    const lastViewed = userData.lastViewed;
    await deleteFavourite(id, lastViewed);
  });
  db.close();
}

export const deleteFavourite = async (id: number, coinSymbol: string) => {
  const sql = `SELECT * FROM users WHERE userId = ${id}`;
  const db = new sqlite3.Database(DB_PATH);
  await db.get(sql, async (err: Error, userData: userData) => {
    if (err) {
      console.log(err);
    }
    const favouriteCoins = String(userData.favourite).split(",");
    const index = favouriteCoins.indexOf(coinSymbol);
    if (index !== -1) {
      favouriteCoins.splice(index, 1);
    }
    const newFavourite = favouriteCoins.join(",");
    await db.run(
      `UPDATE users SET favourite = "${newFavourite}" WHERE userId = ${id}`
    );
  });
  db.close();
}

export const addUserToDb = (id: number) => {
  const sql = `INSERT OR IGNORE INTO users (userId, favourite, lastViewed) VALUES (${id}, "", "")`;
  const db = new sqlite3.Database(DB_PATH);
  db.run(sql, [], (err: Error) => {
    if (err) {
      console.log(err);
    }
  });
  db.close();
}

export const updateLastViewed = (id: number, lastViewed: string) => {
  const sql = `UPDATE users SET lastViewed = "${lastViewed.replace(
    "/",
    ""
  )}" WHERE userId = ${id}`;
  const db = new sqlite3.Database(DB_PATH);
  db.run(sql, [], (err: Error) => {
    if (err) {
      console.log(err);
    }
  });
  db.close();
}
