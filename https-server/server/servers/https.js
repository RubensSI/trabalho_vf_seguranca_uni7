var express = require('express'),
  bodyparser = require('body-parser'),
  fs = require('fs'),
  https = require('https'),
  server = express(),
  scribe = require('scribe-js')({ rootPath: 'https-logs' }),
  console = process.console;

module.exports = httpsServer;

function httpsServer(config) {
  var port = config.httpsPort,
    httpsOptions = {
      key: fs.readFileSync('server/ssl/server.key'),
      cert: fs.readFileSync('server/ssl/server.crt'),
      ca: [fs.readFileSync('server/ssl/ca.crt')],
      requestCert: true,
      rejectUnauthorized: false,
      agent: false,

      // This is the password that was used to create the server's certificate.
      // Located in the server/ssl/passphrase file
      passphrase: '1234'
    };

  // configure express to use the scribe logger
  server.use(scribe.express.logger());
  server.use('/https-logs', scribe.webPanel()); // acesso em https://localhost:[port]/logs

  server.use(authChecker);

  //configure express to serve static files from the given directory
  server.use('/assets', express.static(__dirname + '/../../client/public/assets'));
  server.use(express.static(__dirname + '/../../client/private'));

  //configura o express para usar body-parser
  server.use(bodyparser.json());
  server.use(bodyparser.raw());
  server.use(bodyparser.urlencoded({ extended: true }));

  // Crie e inicie o servidor https
  https.createServer(httpsOptions, server).listen(port, function () {
    console.log(' ');
    console.log('Servidor iniciado em https://localhost:' + port + '/');
  });

  return server;
}

/**
    Verifique a autorização do certificado do usuário para determinar se o usuário pode acessar o recurso solicitado ou não
*/
function authChecker(req, res, next) {
  console.log(' ');
  console.log('-----------------------------------');
  console.log('Auth Checker');
  console.log('authorized: ' + req.client.authorized);
  console.log('req.url: ' + req.url);

  if (req.client.authorized === true) {
    next();
  } else if (req.url === '/favicon.ico' || req.url.indexOf('/assets/') === 0) {
    next();
  } else {
    res.status(401).sendFile('unauthorized.html', { root: __dirname + "/../../client/private" });
  }

  console.log('-----------------------------------');
  console.log(' ');
}
