import axios from "axios";
import crypto from 'crypto';
import dotenv from 'dotenv'

dotenv.config()

const tinyUrlToken = process.env.TOKEN

export const getShortedLink = async (link) => {
    const generated = crypto.randomBytes(10).toString('hex');
    const tinyUrlResponse = await axios.post("https://api.tinyurl.com/create",{
        url: link,
        domain: "tiny.one",
        alias: generated,
        api_token: tinyUrlToken
    })
    const {data: {data: {tiny_url: shortedLink}}} = tinyUrlResponse
    return shortedLink
}