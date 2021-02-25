const express = require('express');
var path = require('path');
const app = express();
const port = 3000;

app.use(express.static(`${path.join(__dirname, '..', 'dist')}`));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/widget', (req, res) => {
  res.sendFile(path.join(__dirname + '/widget.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});