const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

const logEvents = require('./logEvents');
const EventEmitter = require('events');
class Emitter extends EventEmitter{};

const myEmitter = new Emitter();
myEmitter.on('log', (msg, fileName) => logEvents(msg, fileName));
const PORT = process.env.PORT || 3550;

const serverFile = async (filePath, contentType, response)=> {
    try{
        const rawData = await fsPromises.readFile(filePath, 'utf8');
        const data = contentType === 'aplication/json' 
            ?JSON.parse(rawData):rawData
        response.writeHead( 
            filePath.includes('404.html') ? 404 : 200,
            {'content-type': contentType})
        response.end(
            contentType === 'application/json' ? JSON.stringify(data) : data
            );
    }   catch(err) {
        console.log(err);
        myEmitter.emit('log', `${err.name}:${err.message}`,'errLog.txt' );
        response.statusCode = 500;
        response.end();
    }
} 
const server = http.createServer((req, res) =>{
    console.log(req.url, req.method);
    myEmitter.emit('log', `${req.url}\t${req.method}`,'reqLog.txt' );

    const extension = path.extname(req.url);

    let contentType;
    switch (extension){
        case '.css':
            contentType = "text/css";
            break;
        case '.js':
            contentType = "text/javascript";
            break;
        case '.json':
            contentType = "text/json";
            break;
        case '.jpg':
            contentType = "text/jpeg";
            break;
        case '.png':
            contentType = "text/png";
            break;       
        case '.txt':
            contentType = "text/plain";
            break;       
        default: 
            contentType = "text/html";
            break;
    }

    let filePath =
        contentType === 'text/html' && req.url === '/'
            ? path.join(__dirname, 'veiws', "index.html")
            :contentType === 'text/html' && req.url.slice(-1) === '/'
                ?path.join(__dirname, 'veiws', req.url, 'index.html')
                :contentType === 'text/html'
                    ?path.join(__dirname,'veiws', req.url)
                    :path.join(__dirname, req.url);
    if (!extension && req.url.slice(-1) !== '/') filePath += 'html';

    const fileExists = fs.existsSync(filePath);

    if (fileExists){
        serverFile(filePath, contentType, res);
    } else {
        switch(console.log(path.parse(filePath).base)){
            case 'old-page.hmtl':
                res.writeHead(301, {'location':'/ new-page.html'});
                res.end();
                break;
            case 'www-page.hmtl':
                res.writeHead(301, {'location':'/'});
                res.end();
            default: 
            serverFile(path.join(__dirname, 'veiws', '404.html'), 'text/html', res);
        }

    }
});

server.listen(PORT, () => console.log('server is running'));

