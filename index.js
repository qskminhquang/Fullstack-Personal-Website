const express = require('express');
const path = require('path');
const crypto = require('crypto');
const NodeRSA = require('node-rsa');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Put all API endpoints under '/api'
var countRSACreateKey = 0;
app.get('/api/create-rsa-key', (req, res) => {
  countRSACreateKey++;
  // Generate RSA Key
  var key = new NodeRSA({b: 2048});
  var keyPair = {
	privatePem: key.exportKey('private'),
	publicPem: key.exportKey('public')
  };
  // Return them as json
  res.json(keyPair);
  console.log('Created new RSAKey #' + countRSACreateKey);
});

app.post('/api/rsa-encryption', (req, res) => {
  // Get parameters
  var RSAKey = req.body.RSAKey;
  var inputText = req.body.inputText;
  var RSAType = req.body.RSAType;
  var result = 'null';
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
	  console.error(error);
	  // expected output: ReferenceError: nonExistentFunction is not defined
	  // Note - error messages will vary depending on browser
  }
  // Return result as json
  res.json({RSAOutput: result});
  if(result !== 'null')
	  console.log(RSAType + ' is complete');
  else
	  console.log(RSAType + 'is not complete, error has occurred');
});

app.post('/api/rsa-sign', (req, res) => {
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
	  console.error(error);
	  // expected output: ReferenceError: nonExistentFunction is not defined
	  // Note - error messages will vary depending on browser
  }
  // Return result as json
  res.json({RSASignResult: result, RSASignature: RSASignature});
  console.log('Sign/Verify status: ' + result);
});

app.post('/api/aes-encryption', (req, res) => {
  // Get parameters
  var AESKey = req.body.AESKey;
  var inputText = req.body.inputText;
  var AESType = req.body.AESType;
  var result = 'null';
  // Generate AES Key
  var cryptKey = crypto.createHash('sha256').update(AESKey).digest();
  try {
	  if(AESType === 'Encryption') {
		var cipher = crypto.createCipher('aes-256-cbc', cryptKey);
        var encrypted = cipher.update(inputText, 'utf8', 'binary');
		encrypted += cipher.final('binary');
		result = new Buffer(encrypted, 'binary').toString('base64');
	  }
	  else {	// Decryption
		var cipher = crypto.createDecipher('aes-256-cbc', cryptKey);
		var cipherText = new Buffer(inputText, 'base64').toString('binary');
		var result = cipher.update(cipherText, 'binary', 'utf8');
		result += cipher.final('utf8');
	  }
  } catch(error) {
	  console.error(error);
	  // expected output: ReferenceError: nonExistentFunction is not defined
	  // Note - error messages will vary depending on browser
  }
  // Return result as json
  res.json({AESOutput: result});
  if(result !== 'null')
	  console.log(AESType + ' is complete');
  else
	  console.log(AESType + 'is not complete, error has occurred');
});

if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, 'front-end/build')));
  // The "catchall" handler: for any request that doesn't
  // match one above, send back React's index.html file.
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'front-end/build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;
app.listen(port);
console.log('Back-end listening on port', port);