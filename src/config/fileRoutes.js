const {resolve} = require('node:path');
const express = require('express');

//resolve serve para montar caminhos
//resolve('pasta1', 'pasta2') -> \projeto\pasta1\pasta2
const uploadPath =  resolve(__dirname, '..', '..', 'uploads')

//Cria um middleware que serve arquivos estaticos
const fileRouteConfig = express.static(uploadPath)

module.exports = fileRouteConfig