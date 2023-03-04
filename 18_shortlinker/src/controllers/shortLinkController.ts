import { ShortLinkUtils } from './../utils/shortLink';
import { RoutesRepository } from './../repository/Repository';
import { Request, Response } from "express";
import dotenv from 'dotenv'
dotenv.config()

const CONN_URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0dep6w4.mongodb.net/?retryWrites=true&w=majority`;
const BASE_URL = process.env.BASE_URL || "localhost:3000/";

export class shortLinkController {
  public uploadController = async (
    req: Request<{ link: string }>,
    res: Response
  ) => {
    const {
      body: { link },
    } = req;
    try {
      const repository = new RoutesRepository(CONN_URL)
      const foundByLink = await repository.findByLink(link)
      if (foundByLink) {
        const shortedLink = foundByLink.shorted_link
        return res.status(200).send(shortedLink)
      }
      const shortedLink = new ShortLinkUtils().createShortLink()
      await repository.loadShorted(link, shortedLink)
      return res.status(200).send(shortedLink)
    }catch(err) {
      console.log(err)
      return res.status(500).send("server error")
    }
  }
  
  public getLinkController = async (
    req: Request<{ link: string }>,
    res: Response
  ) => {
    const {
      params: { link: route },
    } = req;
    
    try {
      const repository = new RoutesRepository(CONN_URL)
      const shortedLink = `${BASE_URL}${route}`
      const responseData = await repository.getLink(shortedLink)
      if (responseData) {
        return res.status(200).send(responseData.link)
      }
      return res.status(404).send("link wasn`t found")
    } catch(err) {
      console.log(err)
      return res.status(500).send("server error")
    }
  }
  
}

