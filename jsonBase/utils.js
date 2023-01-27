const fs = require('fs')

function getData(filename){
    const resData = fs.readFileSync(filename, 'utf8');
    return JSON.parse(resData)
}

function loadData(filename,content){
    fs.writeFileSync(filename, JSON.stringify(content), 'utf8')
}

function getByRoute(route,filename){
    let data = getData(filename)
    return data[route]
}

module.exports = {
    getByRoute,
    getData, 
    loadData
}