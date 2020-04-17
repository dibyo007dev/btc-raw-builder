var btcLib = require("bitcoinjs-lib");
var bip39 = require("bip39");
const axios = require("axios");



const seed = bip39.mnemonicToSeed("neglect come animal country jump when oyster layer tiny cat alter gorilla");

seed.then((val) => {
  let testnet = btcLib.networks.testnet;
  var ec = btcLib.bip32.fromSeed(val, testnet);
  var rroot = ec.derivePath("m/44'/0'/0'/0/2");

  var key = btcLib.ECPair.fromWIF(rroot.toWIF(), testnet);
  const { address } = btcLib.payments.p2pkh({ pubkey: key.publicKey,network:testnet });
    console.log("Private Key : ", key.__D.toString('hex'));
    console.log("Address : ", address);

    var to = "morG3S6BCWF4f3VHmDe9uPbPCRmtYbGjbe";
    var sendingValue = 8000;
    const fee = 500;

axios.get(`https://api.blockcypher.com/v1/btc/test3/addrs/${address}?unspentOnly=true`).then(res => {
    console.log("My Response : ", res.data);

    const balance = res.data.balance;

    var tx = new btcLib.TransactionBuilder(testnet);

    var currBal = 0;
    if(balance > sendingValue){
        res.data.txrefs.map(transObj => {
            if(currBal < sendingValue){
                currBal += transObj.value;
                n = transObj.tx_output_n;
                tx_hash = transObj.tx_hash;

                tx.addInput(tx_hash,n);
            }
        })
    }

    var returnBack = currBal - sendingValue - fee ;

// Get transaction to add-up to required amount

  //reciver address
  tx.addOutput(to, sendingValue);  
  tx.sign(0, key);
  console.log(tx.build().toHex());
});

  
});