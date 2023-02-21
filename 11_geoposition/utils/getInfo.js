import fs from 'fs'

const DBNAME = "db.CSV"

function getData(filename){
    const resData = fs.readFileSync(filename, 'utf8');
    return resData.split("\n")
}

function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    let result = -1;
    while (left <= right) {
        let mid = left + Math.floor((right - left) / 2);
        let check = Number(arr[mid].split(",")[0].replaceAll(`"`,""))
        if (check < target) {
            result = mid;
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return result;
}


function ip4ToNum(ip){
    ip = ip.split(".")
    return 16777216*Number(ip[0]) + 65536*Number(ip[1]) + 256*Number(ip[2]) + Number(ip[3])
}


export function getCountryByIp(ip){
    const data = getData(DBNAME)
    const dec = ip4ToNum(ip)
    const index = binarySearch(data,dec)
    const country = data[index].split(",")[3].replaceAll(`"`,"")
    return country
}


