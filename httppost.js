//httppost.js
const http = require('http');
 
const cookie = 'id=1;name=lc;';
const data = JSON.stringify({
  name: 'lc',
  age: 13
});
 
const options = {
    host: 'localhost',
    port: 3000,
    path: '/test2',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Cookie': cookie
    }
};
 
const req = http.request(options, res => {
    console.log(`状态码: ${res.statusCode}`);
    res.on('data', d => {
        process.stdout.write(d);
    });
});
 
req.on('error', error => {
    console.error(error);
});
req.write(data);
req.end();