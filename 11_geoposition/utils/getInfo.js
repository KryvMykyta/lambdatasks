import fs from "fs";

const DBNAME = "db.CSV";

const getData = (filename) => {
  const ipRanges = fs.readFileSync(filename, "utf8");
  return ipRanges.split("\n");
}

const binarySearch = (arr, target) => {
  let left = 0;
  let right = arr.length - 1;
  let result = -1;
  while (left <= right) {
    let mid = left + Math.floor((right - left) / 2);
    let check = Number(arr[mid].split(",")[0].replaceAll(`"`, ""));
    if (check < target) {
      result = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return result;
}

const ip4ToNum = (ip) => {
  const ipParameters = ip.split(".");
  return (
    16777216 * Number(ipParameters[0]) +
    65536 * Number(ipParameters[1]) +
    256 * Number(ipParameters[2]) +
    Number(ipParameters[3])
  );
}

export const getCountryByIp = (ip) => {
  const data = getData(DBNAME);
  const decimalIp = ip4ToNum(ip);
  const indexOfRange = binarySearch(data, decimalIp);
  const country = data[indexOfRange].split(",")[3].replaceAll(`"`, "");
  return country;
}
