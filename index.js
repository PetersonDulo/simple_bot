require('dotenv').config()
const Swap = require( "./Swap.json")
const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
const Web3 = require('web3')
const HDWalletProvider = require('@truffle/hdwallet-provider')
const moment = require('moment-timezone')
const numeral = require('numeral')
const _ = require('lodash')

// SERVER CONFIG
const PORT = process.env.PORT || 5000
const app = express();
const server = http.createServer(app).listen(PORT, () => console.log(`Listening on ${PORT}`))

// WEB3 CONFIG
const mnemonicPhrase = " batom destaque         outubro    metade textura  viga   volante  zangado  rapadura   paulada      vogal   "; // 12 word mnemonic
/*const provider = new Web3.providers.HttpProvider(
    "http://127.0.0.1:8545"
);*/
//const http = require('http');
const Web3HttpProvider = require('web3-providers-http');
const { INSPECT_MAX_BYTES } = require('buffer')

const options = {
    keepAlive: true,
    timeout: 20000, // milliseconds,
    headers: [{ name: 'Access-Control-Allow-Origin', value: '*' }, { }],
    withCredentials: false,
    agent: { /*http: http.Agent(), baseUrl: ''*/ }
};

const provider = new Web3HttpProvider('http://localhost:8545', options);
/*let provider = new HDWalletProvider({
    mnemonic: {
        phrase: mnemonicPhrase
    },
    providerOrUrl: "http://localhost:8545"
});*/
//let provider = new HDWalletProvider(process.env.MNEMONIC, "http://localhost:8545");
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://192.168.0.101:7545'))
//const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://192.168.43.176:7545'))


async function net(){
    return await web3.eth.net.getId();
}
//const networkId = net();
//const deployedNetwork = Swap.networks[networkId];
const EXCHANGE_ADDRESS = '0xa58252F181a4A703ef0684aA6161A3fB571DE195';
const exchangeContract = new web3.eth.Contract(Swap.abi, EXCHANGE_ADDRESS, {
    from: '0xD605F3Ab23699AC513464B3a710fF3b8c58fb474', // default from address
    gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
});
//const deployedNetwork = Swap.networks[networkId];
const C1_ADDRESS = '0xBbA50782e4d1066A865F67e2Bb8B60Bf1959fE85';
const c1_Contract = new web3.eth.Contract(Swap.abi, C1_ADDRESS, {
    from: '0xD605F3Ab23699AC513464B3a710fF3b8c58fb474', // default from address
    gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
});
//const deployedNetwork = Swap.networks[networkId];
const C2_ADDRESS = '0xC0b74357d95fA3e899F1dc1f4d8f3895BfAcE851';
const c2_Contract = new web3.eth.Contract(Swap.abi, C2_ADDRESS, {
    from: '0xD605F3Ab23699AC513464B3a710fF3b8c58fb474', // default from address
    gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
});
//const deployedNetwork = Swap.networks[networkId];
const C3_ADDRESS = '0x23212a6B2378dA11A18Fc06a1a7AB9D595c26638';
const c3_Contract = new web3.eth.Contract(Swap.abi, C3_ADDRESS, {
    from: '0xD605F3Ab23699AC513464B3a710fF3b8c58fb474', // default from address
    gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
});
console.log(web3.eth.net.getId()

);

var matrix = [];
var max_price = 0;
var min_price = 0;
async function updatePar() {

    for (var i = 0; i < 3; i++) {
        matrix[i] = [];
        for (var j = 0; j < 3; j++) {
            if (i != j) {
                matrix[i][j] = web3.utils.fromWei(await exchangeContract.methods.priceCoinAt(i, j).call());
                //reverse_matrix[i][j] = web3.utils.fromWei(await exchangeContract.methods.priceCoinAt(j, i).call());
            }
        }
    }
}
async function setMaxPrice() {

    for (var i = 0; i < 3; i++) {
        matrix[i] = [];
        for (var j = 0; j < 3; j++) {
            if (matrix[i][j]>max_price) {
                max_price = matrix[i][j];
            }
        }
    }
}
async function setMinPrice() {

    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (matrix[i][j]<min_price) {
                min_price = matrix[i][j];
            }
        }
    }
}

let a = async () => {
    console.log(111);
    /*await exchangeContract.methods.signUp(100002374, 'Petelson Dulo').send({
        from: '0xD605F3Ab23699AC513464B3a710fF3b8c58fb474', // default from address
        gas: 6721975,
        gasPrice: 20000000000
    });*/
    await c1_Contract.methods.approve(EXCHANGE_ADDRESS, web3.utils.toWei('2000')).send({
        from: '0xD605F3Ab23699AC513464B3a710fF3b8c58fb474', // default from address
        gas: 6721975,
        gasPrice: 20000000000
    });
    await c2_Contract.methods.approve(EXCHANGE_ADDRESS, web3.utils.toWei('2000')).send({
        from: '0xD605F3Ab23699AC513464B3a710fF3b8c58fb474', // default from address
        gas: 6721975,
        gasPrice: 20000000000
    });
    await c3_Contract.methods.approve(EXCHANGE_ADDRESS, web3.utils.toWei('2000')).send({
        from: '0xD605F3Ab23699AC513464B3a710fF3b8c58fb474', // default from address
        gas: 6721975,
        gasPrice: 20000000000
    });
}

a()
async function hello() {
    let symbol1 = await exchangeContract.methods.priceCoin(C1_ADDRESS, C3_ADDRESS).call();
    await exchangeContract.methods.swap(C1_ADDRESS, C3_ADDRESS, web3.utils.toWei('5')).send({
        from: '0xD605F3Ab23699AC513464B3a710fF3b8c58fb474', // default from address
        gas: 6721975,
        gasPrice: 20000000000
    });
    console.log(web3.currentProvider.connected, 'Hello!W', symbol1, matrix);
}
// Check markets every n seconds
    const POLLING_INTERVAL = process.env.POLLING_INTERVAL || 1000 // 1 Second
    priceMonitor = setInterval(async () => { await hello() }, POLLING_INTERVAL)
//priceMonitor = setInterval(async () => { await monitorPrice() }, POLLING_INTERVAL)
