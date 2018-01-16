const express = require('express');
const app = express();

var server = app.listen(8082, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
});

app.get('/', function (req, res) {
    res.send('Hello World');
});

