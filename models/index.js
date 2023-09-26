import fs from "fs";

/*
    Insert the data into fs
*/

function insertDB(body) {
    let data = fs.readFileSync("db/data.json");
    data = JSON.parse(data);
    body.deadline = new Date(body.deadline);
    data.push(body);
    fs.writeFileSync("db/data.json", JSON.stringify(data));
}

/*
    Update the data into fs
*/

function updateDB(body, _id) {
    let error = {};
    let data = fs.readFileSync("db/data.json");
    data = JSON.parse(data);
    let index = data.findIndex(ele => ele._id === _id);
    if (index === -1) {
        error.message = "The _id is invalid. Bad request"
    } else {
        body._id = _id;
        data[index] = body;
        fs.writeFileSync("db/data.json", JSON.stringify(data));
    }
    return error;
}

export { insertDB, updateDB };