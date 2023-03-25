const httpUtils = require("./httpUtils")

const http = require('http');
const url = require("url");
const util = require('util');
const querystring = require('querystring'); //字符串显示的数据显示成对象数据
// 引入Formidable模块
const formidable = require('formidable');
const fs = require("fs");
const cst = require("../constants");

/**
 * 获取GET请求内容 
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 */
function toGet(req, res) {
  console.log("=======================")
  let urlObj = url.parse(req.url);
  let receoveData = querystring.parse(urlObj["query"]);
  console.log("urlObj", receoveData)
  let responsData = {};
  let data = 'GET请求内容：\n' + util.inspect(urlObj);
  httpUtils.writeFormHead(200, res);
  responsData["code"] = 200;
  responsData["pathName"] = urlObj.pathname;
  responsData["msg"] = "Get 请求获取成功";
  responsData["data"] = receoveData;
  // console.log(data)
  // res.write("responsData")
  res.end(JSON.stringify(responsData));
}

/**
 * 获取POST请求内容、cookie 
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 */
function toPost(req, res) {
  // 回传的信息
  let responsData = {};
  // 解析客户端请求的链接路径
  let urlObj = url.parse(req.url);
  // 解析客户端传来指令头中的content-type
  let contentType = req.headers["content-type"];
  // 创建formidable表单解析
  const form = new formidable.IncomingForm();

  //=========================================
  if (contentType.includes("multipart/form-dat")) {
    console.log(cst.dirPath)
    form.parse(req, (err, fields, files) => {
      if (err) {
        // 回传的指令头
        httpUtils.writeFormHead(201, res);
        res.end("解析失败")
        throw err;
      }
      // 获取表单数据
      console.log("表单数据", fields);
      // 获取上传文件
      console.log("上传文件", files);
      // httpUtils.writeFormHead(200, res);
      res.writeHead(200, {'Content-Type': contentType})
      // console.log(requestBody)
      responsData["code"] = 200;
      responsData["pathName"] = urlObj.pathname;
      responsData["msg"] = "POST 请求获取成功";
      responsData["data"] = fields;
      for (let key in files){
        // fs.writeFileSync(cst.dirPath+'/file/'+files[key].originalFilename, files[key]);
        fs.copyFileSync(files[key].filepath,  cst.dirPath+'/file/'+files[key].originalFilename);
        // res.sendDate(files[key])
      }
      res.end(JSON.stringify(responsData));  
    });
  } else {
    // 定义了一个data变量，用于暂存请求体的信息
    const _data = []
    // 通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
    req.on('data', function (chunk) {
      _data.push(...chunk)
    });
    req.on('end', () => {
      try {
        // 回传的指令头
        httpUtils.writeFormHead(200, res);
        let requestBody;
        let data = null;
        let promise = new Promise((resolve, reject) => {
          if (contentType.includes("application/json")) {
            requestBody = String.fromCharCode.apply(null, new Uint8Array(_data));
            data = JSON.parse(requestBody);
            resolve(data);
          } else if (contentType.includes("multipart/form-dat")) {
            data = querystring.parse(requestBody);
            // 解析表单
            resolve(data);
          } else if (contentType.includes("application/x-www-form-urlencoded")) {
            requestBody = String.fromCharCode.apply(null, new Uint8Array(_data));
            data = querystring.parse(requestBody);
            resolve(data);
          } else {
            requestBody = String.fromCharCode.apply(null, new Uint8Array(_data));
            data = requestBody;
            resolve(data);
          }
        });

        promise.then(data => {
          // console.log(requestBody)
          responsData["code"] = 200;
          responsData["pathName"] = urlObj.pathname;
          responsData["msg"] = "POST 请求获取成功";
          responsData["data"] = data;
          res.end(JSON.stringify(responsData));
        })


      } catch (error) {
        // 回传的指令头
        httpUtils.writeFormHead(201, res);
        res.end("解析失败")
      }

    })
  }



}

module.exports = {
  toGet,
  toPost
}
