const axios = require("axios")

const generateToken = async () => {
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  const url = 'https://apps.qa.interswitchng.com/passport/oauth/token?grant_type=client_credentials'

  const token = await axios(url, options).then(response => {
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

  const url = 'https://payment-service.k8.isw.la/api/v3/purchases/otps/auths'

  const authenticate = await axios(url, options).then(response => {
    console.log(response.data.responseCode)
  })
  
  fetch('https://payment-service.k8.isw.la/api/v3/purchases/otps/auths', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));
}

const makePayment = async (amount, token) => {
  const param = {
    customerId: "1407002510",
    amount: JSON.stringify(amount),
    transactionRef: "12n345mmm0km655",
    currency: "NGN",
    authData: "G3cf/VTtAHCdHZNxc5GXWRI8z5P0goL2amXWDVFgb6D3XK/QMtZW90TYdl5zffDCNpiZThJzk0+eEU/Y/aYS6fyIOpQZGFrOr8hmvx5869sl2kr5u8qjnM7q5b4ZnTqdKDLtNxr3Qr7anj6YLpox1FOsiyT26mktXL+7SFOaZ15NMtne1z4xrj4R2SndowI/Znsapo7Gfzvp+L7XJyQ8kLYYRk3INjvmRPPQoJg1R0Nnh6EQE3ldIdwylB7GKtr6a71N/yCd4ZtyIcqq1ZNzdWcZyy5eEBAlDIxuECdBqH6hRq2/RbkfARqidNN4Kq0WviSRaRYGbiNjl2W9pNcM8g=="
  };
  const options = {
    url: '/api/v3/purchases',
    method: 'POST',
    baseURL: 'https://payment-service.k8.isw.la',
    port: 443,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      params: param

    }
  }

  const makePayment = await axios(options).then(response => {
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

