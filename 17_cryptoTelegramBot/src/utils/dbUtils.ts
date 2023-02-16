import { getMessageOfList } from "./getCryptoData";

const sqlite3 = require('sqlite3').verbose();



type userData = {[key: string] : string | number}

export async function sendFavourite(id: number, callback: (str: string)=>void) {
    let sql = `SELECT * FROM users WHERE userId = ${id}`
    const db = new sqlite3.Database(`./usersDb.db`)
    await db.get(sql, async (err: Error, row: userData) => {
        if (err) {
        console.log(err)
        }
        if(String(row.favourite) === ""){
            callback("You have empty list of favourites")
            return 0
        }
        let data = await getMessageOfList(String(row.favourite).split(","))
        callback(data)
    });
    db.close()

}

export async function addToFavourite(id: number, coinSymbol: string) {
    let sql = `SELECT * FROM users WHERE userId = ${id}`
    const db = new sqlite3.Database(`./usersDb.db`)
    await db.get(sql, async (err: Error, row: userData) => {
        if (err) {
        console.log(err)
        }
        if (String(row.favourite) === ""){
            await db.run(`UPDATE users SET favourite = "${coinSymbol}" WHERE userId = ${id}`)
            return 0
        }
        let favourite = String(row.favourite).split(",")
        if(!favourite.includes(coinSymbol)){
            favourite.push(coinSymbol)
        }
        let newFavourite = favourite.join(",")
        await db.run(`UPDATE users SET favourite = "${newFavourite}" WHERE userId = ${id}`)
    });
    db.close()

}

export async function checkInFavourite(id: number, coinSymbol: string, callback: (keyboard: any)=>void, msgid: number) {
    let sql = `SELECT * FROM users WHERE userId = ${id}`
    const db = new sqlite3.Database(`./usersDb.db`)
    await db.get(sql, async (err: Error, row: userData) => {
        if (err) {
        console.log(err)
        }
        let favourite = String(row.favourite).split(",")
        let exists = favourite.includes(coinSymbol)
        console.log("ok")
        if(exists){
            callback({
                reply_to_message_id: msgid,
                reply_markup: {
                    resize_keyboard: true,
                    one_time_keyboard: true,
                    remove_keyboard: true,
                    keyboard: [
                        [{text: 'Delete from favourite'}],
                    ],
                }
            })
        }
        else {
            callback({
                reply_to_message_id: msgid,
                reply_markup: {
                    resize_keyboard: true,
                    one_time_keyboard: true,
                    remove_keyboard: true,
                    keyboard: [
                        [{text: 'Add to favourite'}],
                    ],
                }
            })
        }
    });
    db.close()
}

export async function addLastViewed(id: number) {
    let sql = `SELECT * FROM users WHERE userId = ${id}`
    const db = new sqlite3.Database(`./usersDb.db`)
    await db.get(sql, async (err: Error, row: userData) => {
        if (err) {
        console.log(err)
        }
        let lastViewed = String(row.lastViewed)
        if (lastViewed.length > 2 && lastViewed.length < 6) {await addToFavourite(id, lastViewed)}
        
    });
    db.close()
}

export async function deleteLastViewed(id: number) {
    let sql = `SELECT * FROM users WHERE userId = ${id}`
    const db = new sqlite3.Database(`./usersDb.db`)
    await db.get(sql, async (err: Error, row: userData) => {
        if (err) {
        console.log(err)
        }
        let lastViewed = String(row.lastViewed)
        await deleteFavourite(id, lastViewed)
    });
    db.close()
}

export async function deleteFavourite(id: number, coinSymbol: string) {
    let sql = `SELECT * FROM users WHERE userId = ${id}`
    const db = new sqlite3.Database(`./usersDb.db`)
    await db.get(sql, async (err: Error, row: userData) => {
        if (err) {
        console.log(err)
        }
        let favourite = String(row.favourite).split(",")
        if(favourite.includes(coinSymbol)){
            let index = favourite.indexOf(coinSymbol)
            if (index !== -1){
                favourite.splice(index,1)
            }
        }
        let newFavourite = favourite.join(",")
        await db.run(`UPDATE users SET favourite = "${newFavourite}" WHERE userId = ${id}`)
    });
    db.close()

}

export function addUserToDb(id: number) {
    const hypeCoins = ["BTC", "ETH", "BCH", "XRP", "DOGE"]
    const hypeCoinsString = hypeCoins.join(",")
    let sql = `INSERT OR IGNORE INTO users (userId, favourite, lastViewed) VALUES (${id}, "", "")`
    const db = new sqlite3.Database(`./usersDb.db`)
    db.run(sql, [], (err: Error, row: userData) => {
        if (err) {
            console.log(err)
        }
    });
    db.close()
}

export function updateLastViewed(id: number, lastViewed: string){
    let sql = `UPDATE users SET lastViewed = "${lastViewed.replace("/","")}" WHERE userId = ${id}`
    const db = new sqlite3.Database(`./usersDb.db`)
    db.run(sql, [], (err: Error, row: userData) => {
        if (err) {
            console.log(err)
        }
    });
    db.close()
}
