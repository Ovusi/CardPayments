const axios = require("axios")
const dotenv = require("dotenv")
const forge = require("node-forge")

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

const confirmTransaction = async () => {
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer eyJhbGciOiJSUzI1NiJ9.eyJtZXJjaGFudF9jb2RlIjoiTVg2MDcyIiwicmVxdWVzdG9yX2lkIjoiMTIzODA4NTk1MDMiLCJwYXlhYmxlX2lkIjoiMzM1OTciLCJjbGllbnRfZGVzY3JpcHRpb24iOm51bGwsImNsaWVudF9pZCI6IklLSUFCMjNBNEUyNzU2NjA1QzFBQkMzM0NFM0MyODdFMjcyNjdGNjYwRDYxIiwiYXVkIjpbImFyYml0ZXIiLCJjYWVzYXIiLCJoaW1zLXBvcnRsZXQiLCJpc3ctY29sbGVjdGlvbnMiLCJpc3ctY29yZSIsImlzdy1pbnN0aXR1dGlvbiIsImlzdy1wYXltZW50Z2F0ZXdheSIsInBhc3Nwb3J0IiwicHJvamVjdC14LW1lcmNoYW50IiwicmVjdXJyZW50LWJpbGxpbmctYXBpIiwicmVmZXJyYWwtc2VydmljZS1hcGkiLCJ0cmFuc2Zlci1zZXJ2aWNlLWFkbWluIiwidHJhbnNmZXItc2VydmljZS1jb3JlIiwid2FsbGV0Iiwid2VicGF5LXBvcnRsZXQiXSwiY2xpZW50X2F1dGhvcml6YXRpb25fZG9tYWluIjoiTVg2MDcyIiwic2NvcGUiOlsicHJvZmlsZSJdLCJhcGlfcmVzb3VyY2VzIjpbInJpZC1QT1NUL2FwaS92MS9wdXJjaGFzZXMiLCJyaWQtUE9TVC9hcGkvdjEvcHVyY2hhc2VzLyoqIiwicmlkLVBVVC9hcGkvdjEvcHVyY2hhc2VzIiwicmlkLVBVVC9hcGkvdjEvcHVyY2hhc2VzLyoqIiwicmlkLUdFVC9hcGkvdjEvcHVyY2hhc2VzIiwicmlkLUdFVC9hcGkvdjEvcHVyY2hhc2VzLyoqIiwicmlkLURFTEVURS9hcGkvdjEvcHVyY2hhc2VzIiwicmlkLURFTEVURS9hcGkvdjEvcHVyY2hhc2VzLyoqIiwicmlkLVBPU1QvYXBpL3YyL3B1cmNoYXNlcyIsInJpZC1QT1NUL2FwaS92Mi9wdXJjaGFzZXMvKioiLCJyaWQtUFVUL2FwaS92Mi9wdXJjaGFzZXMiLCJyaWQtUFVUL2FwaS92Mi9wdXJjaGFzZXMvKioiLCJyaWQtR0VUL2FwaS92Mi9wdXJjaGFzZXMiLCJyaWQtR0VUL2FwaS92Mi9wdXJjaGFzZXMvKioiLCJyaWQtREVMRVRFL2FwaS92Mi9wdXJjaGFzZXMiLCJyaWQtREVMRVRFL2FwaS92Mi9wdXJjaGFzZXMvKioiLCJyaWQtUE9TVC9hcGkvdjMvcHVyY2hhc2VzIiwicmlkLVBPU1QvYXBpL3YzL3B1cmNoYXNlcy8qKiIsInJpZC1QVVQvYXBpL3YzL3B1cmNoYXNlcyIsInJpZC1QVVQvYXBpL3YzL3B1cmNoYXNlcy8qKiIsInJpZC1HRVQvYXBpL3YzL3B1cmNoYXNlcyIsInJpZC1HRVQvYXBpL3YzL3B1cmNoYXNlcy8qKiIsInJpZC1ERUxFVEUvYXBpL3YzL3B1cmNoYXNlcyIsInJpZC1ERUxFVEUvYXBpL3YzL3B1cmNoYXNlcy8qKiJdLCJleHAiOjMxODE0OTY1MzIsImNsaWVudF9uYW1lIjoiUjdqSmhyRWd5TCIsImNsaWVudF9sb2dvIjpudWxsLCJqdGkiOiI0OWNiNjg1Yi1hMmZkLTRkMDktOGUyYy1mMDJlMjQ4YWNlYzAifQ.XWEJ-HSYXzXpZF63Ryn4m8JfWbuQSdmiH7wg-BoxYSTiYOT5C-PaoYIoP4SWx-MnEnTJyvDiuZHSUtEdnK5GBmYEpCnRWkdRMmD2gIGFk0cFOp716wCt398PnRyu80rMWv0xV69BsSV6wyxg-Q2rChwr4nMmttxjwqH8IHaG7ES4DXSBhFd-aui8GDVs4cek1ly54GL--NKtpIrrLj7CdWY4_5hjTTPjFSWelQ1sO_kuJAQof932WMybOKwOfZcmirPZ6jU2L8UZdXusxMQUJ3e6is2JVZ3ljM_dOGA98ERsne6qNw-yahh5bFxv1joRrPR9XgGjzZMLqZJ1Qn4zGQ'
    }
  };

  const url = 'https://qa.interswitchng.com/collections/api/v1/gettransaction.json?merchantCode=MX6072&transactionReference=123456xx1x&merchantcode=merchantcode&transactionreference=reference&amount=amount%20%2F'

  const status = await axios(url, options).then(response => {
    console.log(response.data)
  })
}

