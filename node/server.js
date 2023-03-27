const http = require('http'),
      url = require('url');
var server = http.createServer(function(request, response)
{
    let parsed_url = url.parse(request.url, true);
    if (parsed_url.pathname == '/echo' && request.method == 'POST')
    {
        let message = new Object;
        request.on('data', data => message = data;);
        request.on('end', () => response.end(message));
    }
    else response.end('Hello, World!');
    response.writeHead(200, "OK", {'Cache-control': 'no-cache'});
});
server.listen(process.env.PORT);
console.log(`Server started!`);