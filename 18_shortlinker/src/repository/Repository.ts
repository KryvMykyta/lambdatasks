import { MongoClient } from "mongodb";
import dotenv from 'dotenv'
dotenv.config()

type dataRecord = {
    link: string,
    shorted_link: string,
}

export class RoutesRepository {
  client: MongoClient;
  constructor(CONN_URL: string) {
    this.client = new MongoClient(CONN_URL);
  }

  private init = async () => {
    await this.client.connect();
    return this.client.db(process.env.DB_NAME).collection("routes");
  };

  public findByLink = async (link: string) => {
    const data = await this.init();
    const linkRecord = await data.findOne<dataRecord>({ link: link });
    if(linkRecord) return linkRecord
    return undefined
  };

  public loadShorted = async (link: string, shortedLink: string) => {
    const data = await this.init()
    await data.insertOne({
        link: link,
        shorted_link: shortedLink,
    });
  };

  public getLink = async (shortedLink: string) => {
    const data = await this.init();
    const linkRecord = await data.findOne<dataRecord>({ shorted_link: shortedLink });
    return linkRecord
  };
}
