const url = require("url");
const {StringDecoder} = require("string_decoder");
const routes = require("../routes");
const { notFoundHandler } = require("../helpers/routesHandler/notFoundHandler");

const handler = {};

handler.handleReqRes = (req, res) => {
    const parsedUrl = url.parse(req.url);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryObject = parsedUrl.query;
    const headersObject = req.headers;

    const requestProperties = {
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryObject,
        headersObject
    };

    const decoder = new StringDecoder("utf-8");
    let data = '';

    const router = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;

    req.on('data', (buffer) => {
        data += decoder.write(buffer);
    });
    req.on('end', () => {
        data += decoder.end();
        output = {};
        try {
            output = JSON.parse(data);
        } catch (error) {
            output = {};
        }
        requestProperties.body = output;

        router(requestProperties, (statusCode, payload) => {
            statusCode = typeof(statusCode) === 'number' ? statusCode : 500;
            payload = payload || {};

            const payloadString = JSON.stringify(payload);
    
            res.setHeader("Content-Type", "application/json")
            res.writeHead(statusCode);
            res.end(payloadString);
        });
    });
}

module.exports = handler