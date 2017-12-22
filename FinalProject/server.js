'use strict';

var http = require('http');
var path = require('path');
var fs = require('fs');

var mimeTypes = {
	'.js' : 'text/javascript',
	'.html' : 'text/html',
	'.css' : 'text/css'
};

function handleRequest(request, response) {
	if (request.url === '/json_data_write') {
		handleJsonData(request);
	} else {
		var lookup = (request.url === '/') ? '/index.html' : decodeURI(request.url);
		var file = lookup.substring(1, lookup.length);

		// console.log('request: ' + request.url);
		fs.exists(file, function(exists) {
			if (exists) {
				console.log('Trying to send: ' + lookup);
				fs.readFile(file, function(err, data) {
					var headers = { 'Content-type': mimeTypes[path.extname(lookup)] };

					if (err) {
						response.writeHead(500);
						response.end('Server Error!');
					} else {
						response.writeHead(200, headers);
						response.end(data);
					}
				});
			} else {
				console.log('Failed to find/send: ' + lookup);
				response.writeHead(404);
				response.end();
			}
		});
	}
	
}

function handleJsonData(request) {
	var body = '';
	request.on('data', function(chunk) {
		body += chunk;
	});

	request.on('end', function() {
		fs.writeFile('json_data.txt', body, function() {});
	});
}

http.createServer(handleRequest).listen(3000, function() {
	console.log('Server is listening on port 3000');
});
