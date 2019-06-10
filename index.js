require('custom-env').env()
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var db = {}
const Blockchain = require('./blockchain/blockchain')

mongoose.connect(process.env.DB, function (err, db_new) {
    if (err) {
        console.log('MongoDB erro=' + err)
    } else {
        db = db_new;
    }
});

var anySchema = new mongoose.Schema({}, { strict: false });
var User = mongoose.model('User', anySchema, 'users');
var Transactions = mongoose.model('Transactions', anySchema, 'transactionss');
var BlockchainDocument = mongoose.model('Blockchain', anySchema, 'blockchains');

app.use(bodyParser.json({ extended: true, limit: "50mb" }));

app.get('/', function (req, res) {
    res.send('Hello World!');
});

async function loadAllBlockchain(req) {
    var collection = await db.collection('blockchain');

    console.log(blockchain.isValid())
    var myBlock = new BlockchainDocument(req.body)
    blockchain.isValid()
}

app.post('/login', async function (req, res) {
    if (req.body.email && req.body.password) {
        var collection = await db.collection('users');
        await collection.find({ email: req.body.email }).toArray((err, users) => {
            console.log(err)
            if (users.length > 0 && users[0].senha == req.body.password) {
                res.json({ status: 200 })
            } else {
                res.sendStatus(401)
            }
        })

    } else {
        res.sendStatus(401)
    }
});

app.post('/signup', async function (req, res) {
    if (req.body.email) {
        var user = new User(req.body);
        user.save()
        res.json({ 'code': '200' });
    } else {
        res.sendStatus(401);
    }
});

app.post('/transaction', async function (req, res) {
    if (req.body.origin) {
        // var user = new User(req.body);
        // user.date = Math.floor(Date.now() / 1000)
        // user.save()
        
        const blockchain = new Blockchain()
        var hash = blockchain.addBlock(req.body).getLastBlock().hash
        
        var obj = req.body;
        obj.hash = hash
        var blocDoc = new BlockchainDocument(obj)
        blocDoc.save();

        res.json({ 'code': '200' });
    } else {
        res.sendStatus(401);
    }
});

app.post('/sendMoney', async function (req, res) {
    if (req.body.origin) {
        var antigo = {}
        var collection_users = await db.collection('users');
        await collection_users.find({ email: req.body.email }).toArray((err, users) => {
            console.log(err)
            if (users.length > 0) {
                antigo = users[0]
            } else {
                res.sendStatus(401)
            }
        })
        antigo.amount = antigo.amount + req.body.amount;
        var collection_transactions = await db.collection('transactions');
        collection_transactions.updateOne({ _id: ObjectId(req.body._id) }, { $set: novo }).then(function (r) {
            res.json({ 'code': '200' });
        });
        var user = new User(req.body);
        user.date = Math.floor(Date.now() / 1000)
        user.save()
        res.json({ 'code': '200' });
    } else {
        res.sendStatus(401);
    }
});

app.post('/listTransactions', async function (req, res) {
    if (req.body.origin) {
        var collection = await db.collection('transactions');
        await collection.find({ email: req.body.email }).toArray((err, transactions) => {
            console.log(err)
            res.send(transactions);
        })
    } else {
        res.sendStatus(401);
    }
});

app.get('/listAllData', function (req, res) {
    res.json([
        {
            nome: 'nome',
            linha: 'ASD23'
        }
    ])
})
var PORT = process.env.port || 3001
app.listen(PORT, function () {
    console.log('Example app listening on port 3000!');
});

