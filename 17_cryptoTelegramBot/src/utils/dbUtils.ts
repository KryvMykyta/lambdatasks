import {
  addKeyboardOptions,
  deleteKeyboardOptions,
} from "./../keyboards/keyboards";
import { getMessageOfList } from "./getCryptoData";

const sqlite3 = require("sqlite3").verbose();

type userData = { favourite: string; userId: number; lastViewed: string };

export async function sendFavourite(
  id: number,
  callback: (str: string) => void
) {
  const sql = `SELECT * FROM users WHERE userId = ${id}`;
  const db = new sqlite3.Database(`./usersDb.db`);
  await db.get(sql, async (err: Error, userData: userData) => {
    if (err) {
      console.log(err);
    }
    if (!userData.favourite) {
      callback("You have empty list of favourites");
      return 0;
    }
    const data = await getMessageOfList(userData.favourite.split(","));
    callback(data);
  });
  db.close();
}

export async function addToFavourite(id: number, coinSymbol: string) {
  const sql = `SELECT * FROM users WHERE userId = ${id}`;
  const db = new sqlite3.Database(`./usersDb.db`);
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

export async function checkInFavourite(
  id: number,
  coinSymbol: string,
  callback: (keyboard: any) => void,
  msgid: number
) {
  const sql = `SELECT * FROM users WHERE userId = ${id}`;
  const db = new sqlite3.Database(`./usersDb.db`);
  await db.get(sql, async (err: Error, userData: userData) => {
    if (err) {
      console.log(err);
    }
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

export async function addLastViewed(id: number) {
  const sql = `SELECT * FROM users WHERE userId = ${id}`;
  const db = new sqlite3.Database(`./usersDb.db`);
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

export async function deleteLastViewed(id: number) {
  const sql = `SELECT * FROM users WHERE userId = ${id}`;
  const db = new sqlite3.Database(`./usersDb.db`);
  await db.get(sql, async (err: Error, userData: userData) => {
    if (err) {
      console.log(err);
    }
    const lastViewed = userData.lastViewed;
    await deleteFavourite(id, lastViewed);
  });
  db.close();
}

export async function deleteFavourite(id: number, coinSymbol: string) {
  const sql = `SELECT * FROM users WHERE userId = ${id}`;
  const db = new sqlite3.Database(`./usersDb.db`);
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

export function addUserToDb(id: number) {
  const sql = `INSERT OR IGNORE INTO users (userId, favourite, lastViewed) VALUES (${id}, "", "")`;
  const db = new sqlite3.Database(`./usersDb.db`);
  db.run(sql, [], (err: Error) => {
    if (err) {
      console.log(err);
    }
  });
  db.close();
}

export function updateLastViewed(id: number, lastViewed: string) {
  const sql = `UPDATE users SET lastViewed = "${lastViewed.replace(
    "/",
    ""
  )}" WHERE userId = ${id}`;
  const db = new sqlite3.Database(`./usersDb.db`);
  db.run(sql, [], (err: Error) => {
    if (err) {
      console.log(err);
    }
  });
  db.close();
}
