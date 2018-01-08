const request = require('request');
const mysql = require('mysql');
const crypto = require('crypto');
const nem = require("nem-sdk").default;
const express = require('express');
const my_lzma = require('lzma');
const app = express();


const compression_mode = 9;

const algorithm = 'aes-256-ctr';
const password = 'd6F3Efeq';

const nem_address = 'TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S';
const nem_default_node = nem.model.nodes.defaultTestnet;
const nem_default_port = nem.model.nodes.defaultPort;
const nem_account_sender_private_key = '30ec9d5154785f0acb2d69e2ad4e12d1d2767f5c50f3209ef9e0bbc443ee3984';
// Create an NIS endpoint object
const nem_endpoint = nem.model.objects.create("endpoint")(nem_default_node, nem_default_port);

function encrypt(text){
    var cipher = crypto.createCipher(algorithm,password)
    var crypted =  cipher.update(text,'utf8','hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text){
    var decipher = crypto.createDecipher(algorithm,password)
    var dec = decipher.update(text,'hex','utf8');
    dec += decipher.final('utf8');
    return dec;
}

function sendToBlockchainAccount(message){
    // Create a common object holding key
    const common = nem.model.objects.create("common")("", nem_account_sender_private_key);

    // Create an un-prepared transfer transaction object
    const transferTransaction = nem.model.objects.create("transferTransaction")(nem_address, 0, message);

    // Prepare the transfer transaction object
    const transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.testnet.id);

    // Serialize transfer transaction and announce
    nem.model.transactions.send(common, transactionEntity, nem_endpoint);
}


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'syafiq',
    password: 'syafiq',
    database: 'etherpad-lite'
});


var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
});


app.get('/', function (req, res) {
    res.send('Hello World');
});

app.get('/update', function(req, res){
    connection.query('SELECT * FROM `etherpad-lite`.store WHERE `key` REGEXP "^pad";', function(err, rows, fields){
        var encrypted = encrypt("My name is Muhammad Syafiq the best in the world");
        sendToBlockchainAccount(encrypted);
        res.send("Finish");
        //Compress
        // my_lzma.compress("My name is Muhammad Syafiq the best in the world", compression_mode, function(result){
        //     var compressed = new Buffer(result)
        //     // console.log("Compressed: " + compressed);
        //     var encrypted = encrypt(compressed)
        //     // console.log("Size of encrypted: " + encrypted.length)
        //     // console.log("Encrypted: " + encrypted);
        //
        //     sendToBlockchainAccount(encrypted);
        //     // setTimeout(retrieveFromBlockchainUsingAccount(nem_endpoint, nem_address), 60);
        //     // retrieveFromBlockchainUsingAccount(nem_endpoint, nem_address);
        //
        //     res.send("Finish");
        // });
        // res.send("Finish");
    });
});

app.get('/request', function(req, res){
    nem.com.requests.account.transactions.all(nem_endpoint, nem_address).then(function(result) {
        console.log("\nAll transactions of the account:");
        message:
        for(var i in result){
            for(var j in result[i]) {
                for (var k in result[i][j]) {
                    var message = result[i][j][k].message;
                    if (typeof message != 'undefined') {
                        var fmt = nem.utils.format.hexMessage(message);
                        var decrypted = decrypt(fmt);
                        // res.send(decrypted);
                        console.log(decrypted);
                        break message;
                    }
                }
            }
        }
    }, function(err) {
        console.error(err);
    });
    res.send("Finish");

});


connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
});

const secret = 'abcdefg';
const hash = crypto.createHmac('sha256', secret)
    .update('I love cupcakes')
    .digest('hex');
console.log(hash);


// // Create an NIS endpoint object
// var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);
//
// // Create a common object holding key
// var common = nem.model.objects.create("common")("", "30ec9d5154785f0acb2d69e2ad4e12d1d2767f5c50f3209ef9e0bbc443ee3984");
//
// // Create an un-prepared transfer transaction object
// var transferTransaction = nem.model.objects.create("transferTransaction")("TBCI2A67UQZAKCR6NS4JWAEICEIGEIM72G3MVW5S", 0, "Hello");
//
// // Prepare the transfer transaction object
// var transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.testnet.id);
//
// // Serialize transfer transaction and announce
// nem.model.transactions.send(common, transactionEntity, endpoint);