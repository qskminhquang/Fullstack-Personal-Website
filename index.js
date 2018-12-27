const express = require('express');
const path = require('path');
const NodeRSA = require('node-rsa');
const app = express();
var count = 0;

// Put all API endpoints under '/api'
app.get('/api/create-rsa-key', (req, res) => {
  count++;
  // Generate RSA Key
  var key = new NodeRSA({b: 2048});
  var keyPair = {
	privatePem: key.exportKey('private'),
	publicPem: key.exportKey('public')
  };
  // Return them as json
  res.json(keyPair);
  console.log('Created new RSAKey #' + count);
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