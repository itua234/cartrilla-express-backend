const http = require('https');
require('dotenv').config();
const secretKey = process.env.PAYSTACK_SECRET;
const baseUrl = process.env.PAYSTACK_BASEURL;

exports.intitializeTransaction = (details) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: baseUrl,
            port: 443,
            path: '/transaction/initialize',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Bearer " + secretKey
            }
        }
        const request = http.request(options, (response) => {
            let data = '';
            response.setEncoding('utf8');
            response.on('data', chunk => {
                data += chunk;
            })
            response.on('end', () => {
                resolve(data);
            })
        }).on('error', e => {
            reject(e);
        })
        const params = JSON.stringify({
            "email": details["email"],
            "channels": ["card", "bank", "ussd"],
            "amount": details["amount"] * 100,
            "callback_url": "http://127.0.0.1:3000/order-complete/",
        })
        request.write(params);
        request.end();
    })
}

exports.getPaymentData = (reference) => {   
    return new Promise((resolve, reject) => { 
        const options = {
            hostname: baseUrl,
            port: 443,
            path: `/transaction/verify/${reference}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Bearer " + secretKey
            }
        }
        const request = http.request(options, (response) => {
            let data = '';
            response.setEncoding('utf8');
            response.on('data', chunk => {
                data += chunk;
            })
            response.on('end', () => {
                resolve(data);
            })
        }).on('error', e => {
            reject(e);
        })
        request.end();
    });
}

exports.getBankList = () => {    
    return new Promise((resolve, reject) => {
        const options = {
            hostname: baseUrl,
            port: 443,
            path: '/bank',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Bearer " + secretKey
            }
        }
        const request = http.request(options, (response) => {
            let data = '';
            response.setEncoding('utf8');
            response.on('data', chunk => {
                data += chunk;
            })
            response.on('end', () => {
                resolve(data);
            })
        }).on('error', e => {
            reject(e);
        })
        const params = JSON.stringify({
            "country": "nigeria"
        })
        request.write(params);
        request.end();
    })
}

exports.getBank = (res, code) => {
    this.getBankList().then(data => {
        let dat = JSON.parse(data);
        res.send(dat["data"]);
    }).catch(err => {
        res.send(err);
    });    

    response = this.getBankList(res);
    let data = response["data"];
    data.forEach(myFunction);
    function myFunction(value){
        if(value["code"] == code){
            let bank = value["name"];
        }
    }
    return res.send(bank);
}

exports.resolve = () => {
    const options = {
        hostname: this.baseUrl,
        port: 443,
        path: '/bank/resolve&account_number=1610455640&code=044',
        method: 'GET',
        headers: {
            Accept: 'application/json',
            responseType: 'json',
            Authorization: 'Bearer ' + this.secretKey
        }
    }
    const request = https.request(options, (response) => {
        let data = '';
        response.on('data', chunk => {
            data += chunk
        })
        response.on('end', () => {
            return data;
        })
    }).on('error', e => {
        return e;
    })
    //request.write(params);
    request.end();
}