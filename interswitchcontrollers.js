const axios = require("axios")

const paymentflow = async (amount, token) => {
    const params = `{
        "customerId": "1407002510",
        "amount": ${amount},
        "transactionRef": "12n345mmm0km655",
        "currency": "NGN",
        "authData": "G3cf/VTtAHCdHZNxc5GXWRI8z5P0goL2amXWDVFgb6D3XK/QMtZW90TYdl5zffDCNpiZThJzk0+eEU/Y/aYS6fyIOpQZGFrOr8hmvx5869sl2kr5u8qjnM7q5b4ZnTqdKDLtNxr3Qr7anj6YLpox1FOsiyT26mktXL+7SFOaZ15NMtne1z4xrj4R2SndowI/Znsapo7Gfzvp+L7XJyQ8kLYYRk3INjvmRPPQoJg1R0Nnh6EQE3ldIdwylB7GKtr6a71N/yCd4ZtyIcqq1ZNzdWcZyy5eEBAlDIxuECdBqH6hRq2/RbkfARqidNN4Kq0WviSRaRYGbiNjl2W9pNcM8g=="
    }`;
    const options = {
      hostname: 'https://payment-service.k8.isw.la',
      port: 443,
      path: '/api/v3/purchases',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    
    
    const request = https.request(options, response => {
      response.on('data', (chunk) => {
        data += chunk;
      })
    
      response.on('end', () => {
        console.log(JSON.parse(data));
      });
    
    }).on('error', error => {
      console.log('error: ', error);
    });
    request.write(params);
    request.end();
}

const paymentsflow = async (amount, token) => {
    const params = `{
        "customerId": "1407002510",
        "amount": ${amount},
        "transactionRef": "12n345mmm0km655",
        "currency": "NGN",
        "authData": "G3cf/VTtAHCdHZNxc5GXWRI8z5P0goL2amXWDVFgb6D3XK/QMtZW90TYdl5zffDCNpiZThJzk0+eEU/Y/aYS6fyIOpQZGFrOr8hmvx5869sl2kr5u8qjnM7q5b4ZnTqdKDLtNxr3Qr7anj6YLpox1FOsiyT26mktXL+7SFOaZ15NMtne1z4xrj4R2SndowI/Znsapo7Gfzvp+L7XJyQ8kLYYRk3INjvmRPPQoJg1R0Nnh6EQE3ldIdwylB7GKtr6a71N/yCd4ZtyIcqq1ZNzdWcZyy5eEBAlDIxuECdBqH6hRq2/RbkfARqidNN4Kq0WviSRaRYGbiNjl2W9pNcM8g=="
    }`;
    const options = {
      baseURL: 'https://payment-service.k8.isw.la/api/v3/purchases',
      port: 443,
      path: '/api/v3/purchases',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    
    
    
}