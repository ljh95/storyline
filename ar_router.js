var http = require('http');
var fs = require('fs');

var app = http.createServer(function(request,response){
    var url = request.url;
    if(request.url == '/'){
      url = '/index0.html';
    }
    /* if(request.url == '/'){
      url = '/index1.html';
    }
    if(request.url == '/'){
      url = '/index2.html';
    }
    if(request.url == '/'){
      url = '/index3.html';
    }
    if(request.url == '/'){
      url = '/index4.html';
    } */
    if(request.url == '/favicon.ico'){
      return response.writeHead(404);
    }
    response.writeHead(200);
    response.end(fs.readFileSync(__dirname + url));
 
});
app.listen(3003);