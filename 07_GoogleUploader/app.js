import dotenv from "dotenv";
import { askPath, confirmShortLink } from "./utils/questions.js";
import { uploadFile } from "./utils/google.js";
import { getShortedLink } from "./utils/tinyurl.js";
dotenv.config();

const FOLDER_ID = process.env.FOLDER_ID;

async function main() {
  const path = await askPath();
  const photoID = await uploadFile(FOLDER_ID, path);
  const confirmShortingLink = await confirmShortLink();
  const link = `https://drive.google.com/uc?export=view&id=${photoID}`;
  if (confirmShortingLink === "yes") {
    try {
      console.log(await getShortedLink(link));
      return 0;
    } catch (err) {
      console.log(
        "Server error when shorting link, use the full link, or try again later"
      );
    }
  }
  console.log(link);
  return 0;
}

main();
