import { google } from "googleapis";
import fs from "fs";
import { newFileName } from "./questions.js";

export const uploadFile = async (id, path) => {
  const fileName = await newFileName(path);
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "keys.json",
      scopes: ["https://www.googleapis.com/auth/drive"],
    });
    const driveService = google.drive({ version: "v3", auth });

    const fileData = {
      name: fileName,
      parents: [id],
    };

    const media = {
      mimeType: "image/jpg",
      body: fs.createReadStream(path),
    };

    const response = await driveService.files.create({
      media: media,
      field: "id",
      resource: fileData,
    });
    console.log(response.data.id);
    return response.data.id;
  } catch (err) {
    console.log(err);
  }
};
