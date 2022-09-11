const http = require('node:http');


const server = http.createServer((req, res) => {

    const method = req.method

    if(req === 'GET')
    
    res.writeHead(200);
    res.end('Hello, World!');
});

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});


server.listen(8000);
console.log('server started on http://localhost:8000')