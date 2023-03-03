import { users } from './../schemas/usersSchema';
import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { eq } from 'drizzle-orm/expressions'

export class UsersRepository {
    dbPath: string;
    constructor(dbPath: string) {
        this.dbPath = dbPath;
    }

    private init = () => {
        const sqlite = new Database(this.dbPath);
        const db: BetterSQLite3Database = drizzle(sqlite);
        return db
    };

    public getFavouriteById = (id: number) => {
        const dbInstance = this.init()
        const userList = dbInstance.select().from(users).where(eq(users.id,id)).all()
        const favourite = userList[0].favourite
        console.log(favourite,id)
        return favourite
    }

    public updateLastViewedById = (id: number, lastViewed: string) => {
        const dbInstance = this.init()
        dbInstance.update(users).set({lastViewed: lastViewed}).where(eq(users.id,id)).run()
    }

    public addFavouriteById = (id: number, favourite: string) => {
        const dbInstance = this.init()
        const favouriteList = this.getFavouriteById(id).split(",")
        let newFavourite = ""
        if(favouriteList[0]){
            favouriteList.push(favourite)
            newFavourite = favouriteList.join(",")
        }
        else{
            newFavourite = favourite
        }
            
        dbInstance.update(users).set({favourite: newFavourite}).where(eq(users.id,id)).run()
    }

    public deleteFavouriteById = (id: number, favourite: string) => {
        const dbInstance = this.init()
        const currentFavouriteList = this.getFavouriteById(id).split(",")
        const newFavourite = currentFavouriteList.filter(e => e!==favourite).join(",")
        dbInstance.update(users).set({favourite: newFavourite}).where(eq(users.id,id)).run()
    }  

    public getLastViewed = (id:number) => {
        const dbInstance = this.init()
        const userList = dbInstance.select().from(users).where(eq(users.id,id)).all()
        const lastViewed = userList[0].lastViewed
        return lastViewed
    }

    public isInFavourite = (id: number, currency: string) => {
        const favouriteList = this.getFavouriteById(id).split(",")
        if(favouriteList.includes(currency)) return true
        return false 
    }

    public createUser = (id: number) => {
        const dbInstance = this.init()
        const userList = dbInstance.select().from(users).where(eq(users.id,id)).all()
        if(!userList[0]){
            dbInstance.insert(users).values({id: id, favourite:"", lastViewed:""}).run()
        }
        
    }
}