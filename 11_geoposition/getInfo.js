import fs from 'fs'

const DBNAME = "db.CSV"

function getData(filename){
    const resData = fs.readFileSync(filename, 'utf8');
    let data = resData.split("\n")
    return data
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
    let num = 16777216*Number(ip[0]) + 65536*Number(ip[1]) + 256*Number(ip[2]) + Number(ip[3])
    return num
}


export function getCountryByIp(ip,filename){
    let data = getData(DBNAME)
    let dec = ip4ToNum(ip)
    let index = binarySearch(data,dec)
    let country = data[index].split(",")[3].replaceAll(`"`,"")
    return country
}


