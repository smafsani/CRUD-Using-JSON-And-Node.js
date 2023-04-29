const data = require("../../lib/data");
const querystring = require("querystring");

const handler = {}

handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if(acceptedMethods.indexOf(requestProperties.method) > -1){
        handler._users[requestProperties.method](requestProperties, callback);
    }
    else{
        callback(405);
    }
};

handler._users = {};

handler._users.post = (requestProperties, callback) => {
    const name = requestProperties.body.name;
    const email = requestProperties.body.email;
    const mobile = requestProperties.body.mobile;
    const id = email.split('@')[0]+Date.now();

    if(name && email && mobile){
        data.read('users', (err1, filedata) => {
            if(!err1){
                let allowed = 1;
                const userObject = {id, name, email, mobile};
                let fileData = [];
                if(!filedata){
                    fileData = [userObject];
                }
                else{
                    fileData = JSON.parse(JSON.parse(filedata));
                    
                    fileData.forEach(element => {
                        if(element.email == userObject.email){
                            allowed = 0;
                            callback(500, {"error" : "Email already used"});
                        }
                    });
                    if(allowed){
                        fileData.push(userObject);
                    }
                }
                if(allowed){
                    const fileObject = JSON.stringify(fileData);
                    data.create('users', fileObject, (erro) => {
                        if(erro == 200){
                            callback(200, {message : "User created successfully"});
                        }else{
                            callback(500, {"error" : "Error"});
                        }
                    });
                }
            }
            else{
                callback(500, {"error" : "Error"});
            }
        });
    }
    else{
        callback(400, {
            message: "Problem in your request"
        });
    }
};

handler._users.get = (requestProperties, callback) => {
    data.read('users', (err, data) => {
        if(!err){
            const dataString = JSON.parse(JSON.parse(data));
            if(requestProperties.queryObject){
                let selectedData = [];
                let queryObject = querystring.parse(requestProperties.queryObject);
                dataString.forEach(element => {
                    if(queryObject.id && element.id == queryObject.id){
                        selectedData.push(element);
                    }
                    else if(queryObject.email && element.email == queryObject.email){
                        selectedData.push(element);
                    }
                    else if(queryObject.name && queryObject.name == element.name){
                        selectedData.push(element);
                    }
                    else if(queryObject.mobile && queryObject.mobile == element.mobile){
                        selectedData.push(element);
                    }
                });
                if(selectedData.length > 0){
                    callback(200, selectedData);
                }
                else{
                    callback(404, {error : "No Data Found"});
                }
            }
            else{
                callback(200, dataString);
            }
        }
        else{
            callback(500, {message : "Unable to read file"});
        }
    });
};

handler._users.put = (requestProperties, callback) => {
    data.read('users', (err, filedata) => {
        if(!err){
            let dataString = JSON.parse(JSON.parse(filedata));
            const name = requestProperties.body.name;
            const email = requestProperties.body.email;
            const mobile = requestProperties.body.mobile;
            if(requestProperties.queryObject){
                const queryObject = querystring.parse(requestProperties.queryObject);
                if(queryObject.id){
                    dataString.forEach(element => {
                        if(queryObject.id == element.id){
                            element.name = name ? name : element.name;
                            element.email = email ? email : element.email;
                            element.mobile = mobile ? mobile : element.mobile;
                        }
                    });
                    data.create('users', JSON.stringify(dataString), (erro) => {
                        if(erro == 200){
                            callback(200, {message : "User Updated successfully"});
                        }else{
                            callback(500, {"error" : "Error"});
                        }
                    });
                }
                else{
                    callback(404, {error: "ID Not Found"});
                }
            }
        }
        else{
            callback(500, "Unable to read file");
        }
    })
};

handler._users.delete = (requestProperties, callback) => {
    data.read('users', (err, filedata) => {
        if(!err){
            let dataString = JSON.parse(JSON.parse(filedata));
            let index = -1;
            if(requestProperties.queryObject){
                const queryObject = querystring.parse(requestProperties.queryObject);
                if(queryObject.id){
                    index = dataString.findIndex(element => element.id == queryObject.id);
                    dataString.splice(index, 1);

                    data.create('users', JSON.stringify(dataString), (erro) => {
                        if(erro == 200){
                            callback(200, {message : "User Removed Successfully"});
                        }else{
                            callback(500, {"error" : "Error while removing an user."});
                        }
                    });
                }
                else{
                    callback(404, {error : "ID Not Found"});
                }
            }
            else{
                callback(500, {error : "Invalid request"});
            }
        }
        else{
            callback(500, "Unable to read file");
        }
    })
};

module.exports = handler;