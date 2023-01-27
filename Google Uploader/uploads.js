import { google } from "googleapis";
import fs from 'fs';

export async function uploadFile(id,str,path){
    try{
        const auth = new google.auth.GoogleAuth({
            keyFile: "keys.json",
            scopes: ['https://www.googleapis.com/auth/drive']
        })
        const driveService = google.drive({version: 'v3', auth})

        const fileData = {
            name: str,
            parents: [id]
        }

        const media = {
            mimeType: 'image/jpg',
            body: fs.createReadStream(path)
        }

        const response = await driveService.files.create({
            media: media,
            field: 'id',
            resource: fileData
        })
        return response.data.id
    }
    catch(err){
        console.log(err)
    }
}
