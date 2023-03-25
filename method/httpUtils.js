const http = require('http');
const url = require("url");
const util = require('util');
const querystring = require('querystring'); //字符串显示的数据显示成对象数据

/**
 * 修改请求头
 * @param {number} code 
 * @param {http.ServerResponse} res 
 */
function writeHead(code, res){
  res.writeHead(code, {'Content-Type': 'text/html;charset=utf-8;'})
}

/**
 * 修改请求头
 * @param {number} code 
 * @param {http.ServerResponse} res 
 */
function writeFormHead(code, res){
  res.writeHead(code, {'Content-Type': 'application/json; charset=utf-8'})
}

/**
 * 解析post请求头 
 * @param {http.IncomingMessage} req 
 */
function parseContentType(req){
  
}

module.exports = {
  writeHead,
  writeFormHead
}