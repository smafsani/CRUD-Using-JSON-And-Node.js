const fs = require('fs');
const path = require('path');

const lib = {};

lib.basedir = path.join(__dirname, '/../data/');

lib.create = (file, data, callback) => {
    const dataString = JSON.stringify(data);
    fs.writeFile(`${lib.basedir}${file}.json`, dataString, (err2) => {
        if(!err2){
            callback(200, {success: "User Created Successfully"});
        }
        else{
            callback(500, {error: "Error writing in file"});
        }
    });
};

lib.read = (file, callback) => {
    fs.readFile(`${lib.basedir}${file}.json`, 'utf-8', (err, data) => {
        callback(err, data);
    });
}

module.exports = lib;