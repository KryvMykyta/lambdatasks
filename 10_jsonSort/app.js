import axios from "axios";
import fs from "fs";

const LISTS = "list.txt";
function getLinks(filename) {
  let resData = fs.readFileSync(filename, "utf8");
  return JSON.parse(resData);
}

async function getInfo(endpoint) {
  let { data: endpointResponse } = await axios.get(endpoint);
  return endpointResponse;
}

function checkLevel(data) {
  if (data.isDone) {
    return data.isDone;
  }
  const keys = Object.keys(data);

  //realization with foreach i dont like

  // let result = ""
  // keys.forEach((key) => {
  //     if (typeof(data[key]) === typeof({})){
  //         const objectByKey = checkLevel(data[key])
  //         if (objectByKey) result = objectByKey
  //     }
  // })
  // return result

  for (let key of keys) {
    if (typeof data[key] === typeof {}) {
      let objectByKey = checkLevel(data[key]);
      if (objectByKey) return objectByKey;
    }
  }
}

async function main() {
  const endpoints = getLinks(LISTS);
  const data = await Promise.all(
    endpoints.map(async (endpoint) => {
      return getInfo(endpoint);
    })
  );
  const counter = {
    trueCount: 0,
    falseCount: 0,
  };
  data.forEach((endpointResponse) => {
    try {
      if (checkLevel(endpointResponse)) {
        counter.trueCount += 1;
      } else {
        counter.falseCount += 1;
      }
    } catch (err) {
      console.log("endpoint is not accessible");
    }
  });
  console.log(counter);
}

main();
