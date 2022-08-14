/**
 * MIT License

Copyright (c) 2022 O'vusi Nobert Jakpor 

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */


const axios = require("axios")
const dotenv = require("dotenv")
const forge = require("node-forge")

require("dotenv").config()

/**
 * @dev Uses the card details stored in an "options" objesct
 * to generate the auth data.
 * 
 * @property {Function} getAuthData
 * @param {object} options Object containing card details. {card: number, pin: number, exp: number, cvv: number}
 * @return {string} authData
 */
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

/**
 * @dev Sends a POST request to the Token API to generate
 * a transaction token which is required to process the card 
 * payment transaction.
 * 
 * @property {Function} generateToken
 * @return {string} Transaction token
 */
const generateToken = async () => {
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  return await axios(process.env.TOKEN_GENERATION_URL, options).then(response => {
    // console.log(response.data)

    if (response.status == 200) {
      return response.data.access_token
    } else {
      return response.status
    }
  }).catch(error => { return error })
}

/**
 * @dev after a payment request is made, we use the OTP 
 * sent to the number of the user to authenticate the
 * transation.
 * 
 * @property {Function} authOTP
 * @param {string} paymentID Payment id for the transaction.
 * @param {string} OTP OTP sent to user's phone number.
 * @param {string} token Previously generated token.
 * 
 * @return {number} Tranaction response code.
 */
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
    return response.data.responseCode
  }).catch(error => {throw error})
}

/**
 * @dev Resend OTP if previous one expires.
 * 
 * @property {Function} resendOTP
 * @param {string} token Transaction token previously generated.
 * @param {string} paymentId_ Payment Id generated from the transaction.
 * @param {string} amount Transaction amount.
 * @return {number} Response status code.
 */
const resendOTP = async (token, paymentId_, amount_) => {
  const options = {
    method: 'POST',
    headers: {
      Accept: 'text/plain',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({paymentId: paymentId_, amount: amount_, currency: 'NGN'})
  };
  
  return await axios(process.env.RESEND_OTP_URL, options).then(response => {
    return response.status
  }).then(response => {return response.status})
  .catch(error => { return error})
}

/**
 * @dev Make a payment call to the Card Payments API.
 * 
 * @property {Function} makePayment
 * @param {string} amount Amount of money to be paid.
 * @param {string} token Previously generated transaction token.
 * @param {string} auth_ Card auth data.
 * @return {tuple} Tuple of Payment details object and response ocde.
 */
const makePayment = async (amount, token, auth_) => {
  const param = {
    customerId: "1407002510",
    amount: amount,
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
      return (response.data, response.data.responseCode)
    } else {
      return response.status
    }
  }).catch(error => {
    return error
  })

}

/**
 * @dev Confirm if transaction was successful.
 * 
 * @property {Function} confirmTransaction
 * @param {string} token Previously generated transaction token.
 * @returns {object} Confirmation data.
 */
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
    return response.data
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
