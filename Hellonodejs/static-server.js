const http = require('http');
const path = require('path');
const config = require('./config/default');

class StaticServer {
    constructor() {
        this.port = config.port;
        this.root = config.root;
        this.indexPage = config.indexPage;
    }

    start() {
        http.createServer((req, res) => {
            const pathName = path.join(this.root, path.normalize(req.url));
            res.writeHead(200);
            res.end(`Requeste path: ${pathName}`);
        }).listen(this.port, err => {
            if (err) {
                console.error(err);
                console.info('Failed to start server');
            } else {
                console.info(`Server started on port ${this.port}`);
            }
        });
    }
}

module.exports = StaticServer;