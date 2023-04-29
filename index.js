const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");

const app = {};

app.config = {
    PORT : 3000,
}

app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.PORT, ()=>{
        console.log(`Server is listening at http://127.0.0.1:${app.config.PORT}`);
    });
};

app.handleReqRes = handleReqRes;

app.createServer();