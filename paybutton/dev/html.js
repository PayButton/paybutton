const express = require('express');
var path = require('path');
const app = express();
const port = 3000;

app.use(express.static(`${path.join(__dirname, '..', 'dist')}`));
app.use(express.static(`${path.join(__dirname)}`));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/default.html'));
});
app.get('/widget', (req, res) => {
  res.sendFile(path.join(__dirname + '/widget.html'));
});
app.get('/advanced', (req, res) => {
  res.sendFile(path.join(__dirname + '/advanced.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
