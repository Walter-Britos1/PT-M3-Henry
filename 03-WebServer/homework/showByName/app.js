var fs  = require("fs")
var http  = require("http")

// Escribí acá tu servidor
http.createServer ((req, res) => {
    fs.readFile(`./images${req.url}.jpg`, (err, data) => {
        if (err){
            res.writeHead(400, {'Content-Type' : 'text/plain'});
            res.end('Img not found...')
        }else {
            res.writeHead(200, {'Content-Type' : 'image/jpeg'});
            res.end(data)
        }
    })
}).listen(1337, '127.0.0.1')