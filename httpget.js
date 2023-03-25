//httpget.js
const http = require('http');
const options = {
    host: 'localhost',
    port: 3000,
    path: '/test?id=1',
    method: 'GET'
};
 
const req = http.request(options, res => {
    console.log(`状态码: ${res.statusCode}`);
    res.on('data', d => {
        process.stdout.write(d);
    });
    req.on('error', error => {
      console.error(error);
    });
});
 
req.on('error', error => {
    console.error(error)
});
req.end();