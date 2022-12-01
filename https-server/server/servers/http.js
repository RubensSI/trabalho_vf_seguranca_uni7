'use strict';

var express = require('express'),
  bodyparser = require('body-parser'),
  server = express(),
  scribe = require('scribe-js')({ rootPath: 'http-logs' }),
  console = process.console;


function httpServer(config) {
  console.log(config);
  var port = config.httpPort;

  // configura o express para usar o scribe logger
  server.use(scribe.express.logger());
  server.use('/http-logs', scribe.webPanel()); // acesso em http://localhost:[port]/logs

  //configure o express para servir arquivos estáticos do diretório fornecido
  server.use(express.static(__dirname + '/../../client/public'));

  //configurar o express para usar o body-parser
  server.use(bodyparser.json());
  server.use(bodyparser.raw());
  server.use(bodyparser.urlencoded({ extended: true }));

  server.listen(port);

  console.log('Server started at http://localhost:' + port + '/');

  return server;
}

module.exports = httpServer;
