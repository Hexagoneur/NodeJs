var http = require('http');

var server =http.createServer((req, res)=>{
    res.writeHead(200);
    res.end('Hello World Salut tout le monde ');
    });

    server.listen(8080,()=>{
        console.log("Serveur démarré sur le port 8080");
    });
    
