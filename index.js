var btcLib = require("bitcoinjs-lib");
var bip39 = require("bip39");
const axios = require("axios");



const seed = bip39.mnemonicToSeed("neglect come animal country jump when oyster layer tiny cat alter gorilla");

seed.then((val) => {
  let testnet = btcLib.networks.testnet;
  var ec = btcLib.bip32.fromSeed(val, testnet);

  var derivationPath = "m/44'/0'/0'/0/7";
  var rroot = ec.derivePath(derivationPath);

  var key = btcLib.ECPair.fromWIF(rroot.toWIF(), testnet);
  const { address } = btcLib.payments.p2pkh({ pubkey: key.publicKey,network:testnet });
    console.log("Private Key : ", key.__D.toString('hex'));
    console.log("Address : ", address);

    var to = "mqKLcLsNuYeTvVisHeYsLnCjgdT1wf4Sk6";
    var sendingValue = 5000;
    const fee = 1000;

axios.get(`https://api.blockcypher.com/v1/btc/test3/addrs/${address}?unspentOnly=true`).then(res => {
    console.log("My Response : ", res.data);

    const balance = res.data.balance;

    var trxDetails = { utxoUsed : []}

    trxDetails.from = address
    trxDetails.path = derivationPath
    trxDetails.to = to
    trxDetails.balance = res.data.balance;
    trxDetails.value = sendingValue;
    trxDetails.fee = fee;

    // var tx = new btcLib.TransactionBuilder(testnet);

    var currBal = 0;
    if(balance > sendingValue + fee){
        res.data.txrefs.map(transObj => {
            if(currBal < sendingValue){
                currBal += transObj.value;

                trxDetails.utxoUsed.push({ n : transObj.tx_output_n, tx_hash : transObj.tx_hash, value : transObj.value, feed_back: 0, fee : 0 })

                // n = transObj.tx_output_n;
                // tx_hash = transObj.tx_hash;

                // tx.addInput(tx_hash,n);
            }
        })
    }
    else {
        throw new Error("Tx not possible ");
    }

    var returnBack = currBal - sendingValue - fee ;

    console.log(returnBack);

    var lenTrx = trxDetails.utxoUsed.length ;

    trxDetails.utxoUsed[lenTrx - 1].feed_back = returnBack;

    var fee_split = fee/lenTrx;

    trxDetails.utxoUsed.map(trxRef => {
        trxRef.fee = fee_split;
    })

    trxDetails.net_feed_back = returnBack;

    console.log(trxDetails);

// Get transaction to add-up to required amount

  //reciver address
//   tx.addOutput(to, sendingValue);
//   tx.addOutput(from, returnBack);  
//   tx.sign(0, key);
//   const txHex = tx.build().toHex();

//   const pushtx = {
//       tx: txHex
//   }

  // push the transaction 
//   axios.post("https://api.blockcypher.com/v1/bcy/test/txs/push", pushtx).then(res => {
//       console.log(res.data);
//   })
    });  
    
});