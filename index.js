const express = require('express');
const path = require('path');
const crypto = require('crypto');
const NodeRSA = require('node-rsa');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const helmet = require('helmet');
const internalIp = require('internal-ip');
const sixtyDaysInSeconds = 5184000;
const app = express();
const PORT = process.env.PORT || 5000;

// My function
function getClientInfo(req) {
  var info = '> Client info:'
	+ '\n  IP Address: ' + req.ip	// Get IP - allow for proxy
	+ '\n  Action: ' + req.method + ' ' + req.protocol + '://' + req.header('host')	// GET, POST
    + '\n  URL: '  + req.originalUrl;	// Likewise for referrer
  return info;
}

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(favicon(path.join(__dirname, '/simple-crypto-frontend/public/favicon.png')));
// Http security headers
app.disable('x-powered-by');
app.use(helmet.xssFilter());	// Sets "X-XSS-Protection: 1; mode=block"
app.use(helmet.hsts({ maxAge: sixtyDaysInSeconds }));	// Sets "Strict-Transport-Security" header
app.use(helmet.noCache());	// Set header Cache-Control and Pragma to turn-off client-side caching
app.use(helmet.noSniff());	// Sets "X-Content-Type-Options: nosniff"
app.use(helmet.frameguard({ action: 'sameorigin' }));	// Sets "X-Frame-Options: SAMEORIGIN"

// Normal request
app.use(express.static(path.join(__dirname, '/public/')));
app.get('/', (req, res) => {
  console.log(getClientInfo(req));
  res.sendFile(path.join(__dirname, '/public/', 'index.html'));
  console.log();
});

// Simple cryptography front-end request
// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/simple-crypto-frontend/build/')));
// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('/crypto', (req, res) => {
  console.log(getClientInfo(req));
  res.sendFile(path.join(__dirname, '/simple-crypto-frontend/build/', 'index.html'));
  console.log();
});

// API request with /api/some-thing
var countRSAKey = 0;
app.get('/api/create-rsa-key', (req, res) => {
  countRSAKey++;
  console.log(getClientInfo(req));
  // Generate RSA Key
  var key = new NodeRSA({b: 2048});
  var keyPair = {
	privatePem: key.exportKey('private'),
	publicPem: key.exportKey('public')
  };
  // Return them as json
  res.json(keyPair);
  console.log('> Created new RSAKey #' + countRSAKey);
  console.log();
});

app.post('/api/rsa-encryption', (req, res) => {
  console.log(getClientInfo(req));
  // Get parameters
  var RSAKey = req.body.RSAKey;
  var inputText = req.body.inputText;
  var RSAType = req.body.RSAType;
  var result = 'err: ';
  // Generate RSA Key, import key and encryption or decryption
  var key = new NodeRSA({b: 2048});
  try {
	  if(RSAType === 'Encryption') {
		key.importKey(RSAKey, 'public');	// Public key with pkcs8-pem
		result = key.encrypt(inputText, 'base64', 'utf8');
	  }
	  else {	// Decryption
		key.importKey(RSAKey, 'private');	// Private key with pkcs1-pem
		result = key.decrypt(inputText, 'buffer');
		result = result.toString('utf8');
	  }
  } catch(error) {
	  result += error.message;
	  //console.error(error.stack);
	  // expected output: ReferenceError: nonExistentFunction is not defined
	  // Note - error messages will vary depending on browser
  }
  // Return result as json
  res.json({RSAOutput: result});
  if(result.startsWith('err')) {
	  console.log('> RSA ' + RSAType + ' is not complete');
	  console.log('  ' + result);
  } else {
	  console.log('> RSA ' + RSAType + ' is complete');
  }
  console.log();
});

app.post('/api/rsa-sign', (req, res) => {
  console.log(getClientInfo(req));
  // Get parameters
  var RSAKey = req.body.RSAKey;
  var inputText = req.body.inputText;
  var RSASignature = req.body.RSASignature;
  var result = 'failure';
  // Generate RSA Key, import key and encryption or decryption
  var key = new NodeRSA({b: 2048});
  try {
	  if(RSASignature === '') {	// Sign
		key.importKey(RSAKey, 'private');	// Private key with pkcs1-pem
		RSASignature = key.sign(inputText, 'base64', 'utf8');
		result = 'success';
	  }
	  else {	// Verify
		key.importKey(RSAKey, 'public');	// Public key with pkcs8-pem
		result = key.verify(inputText, RSASignature, 'utf8', 'base64');
		result = result.toString();
	  }
  } catch(error) {
	  result = result + ' - ' + error.message;
	  // expected output: ReferenceError: nonExistentFunction is not defined
	  // Note - error messages will vary depending on browser
  }
  // Return result as json
  res.json({RSASignResult: result, RSASignature: RSASignature});
  console.log('> Sign/Verify status: ' + result);
  console.log();
});

app.post('/api/aes-encryption', (req, res) => {
  console.log(getClientInfo(req));
  // Get parameters
  var AESKey = req.body.AESKey;
  var inputText = req.body.inputText;
  var AESType = req.body.AESType;
  var result = 'err0';
  try {
	  // Generate AES Key
	  var cryptKey = crypto.createHash('sha256').update(AESKey).digest();
	  if(AESType === 'Encryption') {
		var cipher = crypto.createCipher('aes-256-cbc', cryptKey);
		result = 'err1';
        var encrypted = cipher.update(inputText, 'utf8', 'binary');
		encrypted += cipher.final('binary');
		result = new Buffer(encrypted, 'binary').toString('base64');
	  }
	  else {	// Decryption
		var cipher = crypto.createDecipher('aes-256-cbc', cryptKey);
		var cipherText = new Buffer(inputText, 'base64').toString('binary');
		result = cipher.update(cipherText, 'binary', 'utf8');
		result += cipher.final('utf8');
	  }
  } catch(error) {
	  if(result === '')
		result = 'err2';
	  result = result + ': ' + error.message;
	  // expected output: ReferenceError: nonExistentFunction is not defined
	  // Note - error messages will vary depending on browser
  }
  // Return result as json
  res.json({AESOutput: result});
  if(result.startsWith('err')) {
	  console.log('> AES ' + AESType + ' is not complete');
	  console.log('  ' + result);
  } else {
	  console.log('> AES' + AESType + ' is complete');
  }
  console.log();
});

// Start back-end
app.listen(PORT, () => {
  console.log('> Back-end listening on port ' + PORT + ', view in your the browser');
  console.log('  Local:            http://localhost:' + PORT + '/');
  console.log('  On Your Network:  http://' + internalIp.v4.sync() + ':' + PORT + '/');
  console.log();
});
