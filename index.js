const http = require('node:http');

const isValidRoute = (method, path) => {

    if(method === 'GET' && path === '/'){
        return true
    }
    
    return false
}

const reponse = (res,status,body) =>{
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(status);
    res.end(JSON.stringify(body));
}

const headers = (req) => {

    return {
        method: req.method,
        path: req.url.split('?')[0],
        searchParams: new URLSearchParams(req.url.split('?')[1]),
        auth:  req.headers.authorization
    }

}

const server = http.createServer((req, res) => {

   const {
    method,
    path
   } = headers(req)

    if(isValidRoute(method, path)){
       return reponse(res, 200, {
            canWatch: true,
            endpoint: '/someendpoint.mp4',
            count: 2
        })
    }
    
    res.writeHead(400);
    res.end('Not Supported Endpoint');

});

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});


server.listen(8000);
console.log('server started on http://localhost:8000')