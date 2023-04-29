const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
    callback(404, {
        message : "Requested URL not found"
    });
}

module.exports = handler;