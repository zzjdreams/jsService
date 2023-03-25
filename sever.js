//httpserver.js
const http = require('http');
const url = require("url");
const util = require('util');
const querystring = require('querystring'); //字符串显示的数据显示成对象数据
const fs = require("fs");
const pl = require("./method/responsLoader")
const port = 3000;
console.clear();
http.createServer((req, res) => {
    // // 请求成功的参数
    // res.statusCode = 200;
    // // 请求头
    // res.setHeader('Content-Type', 'text/html;charset=utf-8;');
    // res.write("<h1>欢迎打开服务器页面</h1>");
    if(req.method === 'GET') {
        // toGet(req, res);
        pl.toGet(req, res);
    }else if(req.method === 'POST') {
        // toPost(req, res);
        pl.toPost(req, res);
    }
}).listen(port, () => {
    console.log(`Server listening on: http://localhost:${port}`);
});
 
/**
 * 获取GET请求内容 
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 */
function toGet(req, res){
  let urlObj = url.parse(req.url);
    let data = 'GET请求内容：\n' + util.inspect(urlObj); 
    if (urlObj.pathname == '/'){
      writeHead(200, res);
      fs.readFile(__dirname+"/html/index.html",(err, data)=>{
        res.end(data);
      })
    }
    else if (urlObj.pathname == '/img'){
      data = '<img src="https://img-blog.csdnimg.cn/2d79d40592004b228bcad955a1392090.png" alt="在这里插入图片描述" width="500">';
      writeHead(200, res);
      fs.readFile(__dirname+"/html/279059.jpg", (err, data)=>{
        res.end(data);
      })

      
    }else if(urlObj.pathname == '/error'){
      writeHead(400, res);
      res.end('Sorry, we cannot find that!');
    } else if (urlObj.pathname == '/login'){
      writeHead(200, res);
      fs.readFile(__dirname+"/html/login.html",(err, data)=>{
        res.end(data);
      })
    }else{
      writeHead(200, res);
      res.end(data);
    }
    // res.end(data);
    console.log(data);
}
 
/**
 * 获取POST请求内容、cookie 
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 */
function toPost(req, res){
    let urlObj = url.parse(req.url);
    
    writeHead(200, res);

    // 定义了一个data变量，用于暂存请求体的信息
    let data = '';
    // 通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
    req.on('data', function(chunk){    
        data += chunk;
    }); 
    // 在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
    req.on('end', function(){    
        //data = querystring.parse(data);
        //res.end('POST请求内容：\n' + util.inspect(data));

        // data = 'POST请求内容：\n' + data;
        // res.end({
        //   title:'这是一个标题',
        //   content: '这是内容'
        // });        
        if (urlObj.pathname == '/'){
          let param = querystring.parse(data)
          console.log('~~~~~~~param~~~~~~', param)
          if (param["account"] == 123 && param["password"] == 123){
            console.log("======解析正确的账号和密码=======")
            fs.readFile(__dirname+"/html/index.html",(err, data)=>{
              res.end(data);
            })
          }else{
            console.warn("======解析错误的账号和密码=======")
            res.write("alert('commit user account error')")
            res.end();
          }
          
        }else{
          res.end(data);
        }
        
        console.log(data);
        console.log('cookie内容：\n' + req.headers.cookie);
    });

    
}

/**
 * 修改请求头
 * @param {number} code 
 * @param {http.ServerResponse} res 
 */
function writeHead(code, res){
  res.writeHead(code, {'Content-Type': 'text/html;charset=utf-8;'})
}