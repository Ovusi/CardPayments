const axios = require("axios")
const dotenv = require("dotenv")
const forge = require("node-forge")

require("dotenv").config()


const getAuthData = function(options){
    var authString = "1Z"+options.card + 'Z' + options.pin + 'Z' + options.exp + 'Z' + options.cvv;
    //console.log("Auth-string: "+authString);
    var vv = toHex(authString);
    //var vv = SecureManager.toHex(options.authData);
    //console.log("vv: "+vv);
    var authDataBytes = forge.util.hexToBytes(vv);
    var clearSecureBytes = forge.util.createBuffer();

    var rsa = forge.pki.rsa;
    var modulos = new forge.jsbn.BigInteger(options.publicKeyModulus, 16);
    var exp = new forge.jsbn.BigInteger(options.publicKeyExponent, 16);
    var publicKey = rsa.setPublicKey(modulos, exp);

    var pexp = new forge.jsbn.BigInteger('4913cc0183c7a4a74b5405db55a15db8942f38c8cd7974b3644f6b625d22451e917345baa9750be9f8d10da47dbb45e602c86a6aa8bc1e7f7959561dbaaf35e78a8391009c8d86ee11da206f1ca190491bd765f04953765a2e55010d776044cb2716aee6b6f2f1dc38fce7ab0f4eafec8903a73555b4cf74de1a6bfc7f6a39a869838e3678dcbb96709068358621abf988e8049d5c07d128c5803e9502c05c3e38f94658480621a3e1c75fb4e39773e6eec50f5ef62958df864874ef0b00a0fb86f8382d1657381bc3c283567927f1f68d60205fd7ca1197265dd85c173badc1a15044f782602a9e14adc56728929c646c24fe8e10d26afc733158841d9ed4d1', 16);
    var privateKey = rsa.setPrivateKey(modulos, pexp);

    clearSecureBytes.putBytes(authDataBytes);
    var vvvv = clearSecureBytes.getBytes();

    // console.log("Clear secure: "+forge.util.bytesToHex(vvvv));

    var authBytes = publicKey.encrypt(vvvv);
    var auth = forge.util.encode64(authBytes);
    //console.log("Auth-hex: "+auth);

    //var dauth = privateKey.decrypt(auth, 'RSAES-PKCS1-V1_5');
    //console.log("dauth-hex: "+dauth);

    return auth;
}

const toHex = function(str){

    var hex = '';
    for(var i=0;i<str.length;i++) {
        hex += ''+str.charCodeAt(i).toString(16);
    }
    return hex;

};


const generateToken = async () => {
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };


  return await axios(process.env.TOKEN_GENERATION_URL, options).then(response => {
    console.log(response.data)

    if (response.status == 200) {
      console.log(response.data.access_token)
    }
  })
}

const authOTP = async (paymentID, OTP, token) => {
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({paymentId: paymentID, otp: OTP})
  };

  return await axios(process.env.OTP_AUTHORIZTION_URL, options).then(response => {
    console.log(response.data.responseCode)
  })
}

const resendOTP = async (token) => {
  const options = {
    method: 'POST',
    headers: {
      Accept: 'text/plain',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({paymentId: '3530066', amount: '2000', currency: 'NGN'})
  };
  
  return await axios(process.env.RESEND_OTP_URL, options).then(response => {
    return response.status
  }).then(response => console.log(response.status))
  .catch(error => { return error})
}

const makePayment = async (amount, token, auth_) => {
  const param = {
    customerId: "1407002510",
    amount: JSON.stringify(amount),
    transactionRef: "12n345mmm0km655",
    currency: "NGN",
    authData: auth_
  };

  const options = {
    url: '/api/v3/purchases',
    method: 'POST',
    baseURL: process.env.PAYMENT_API_BASEURL,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      params: param

    }
  }

  return await axios(options).then(response => {
    if (response.status == 200) {
      console.log(response.data)
      console.log(response.data.responseCode)
    } else {
      console.log(response.status)
    }
  }).catch(error => {
    return error
  })

}

const confirmTransaction = async (token) => {
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  };

  return await axios(process.env.PAYMENT_CONFIRMATION_URL, options).then(response => {
    console.log(response.data)
  })
}

module.exports = {
  getAuthData,
  authOTP,
  resendOTP,
  generateToken,
  makePayment,
  confirmTransaction
}
