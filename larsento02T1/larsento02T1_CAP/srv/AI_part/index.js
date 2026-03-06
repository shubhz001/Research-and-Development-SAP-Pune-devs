"use strict";
const pdf_extraction = require('pdf-parse-pages');
const fs = require('fs');
const axios = require('axios');
const ClientOAuth2 = require('client-oauth2');
const { parse } = require('path');
const client_secret = 'edf7fec3-428d-4983-b574-536143d70001$I7GPwBkjWwNnKDZmo7PQ3MZ0w4sDNKtO3pOpYKReCZU=';
const client_id = 'sb-b66c3931-8480-4dfd-8108-0992e56cac64!b476474|aicore!b540';
const accessTokenUri = 'https://genai-ltim.authentication.eu10.hana.ondemand.com/oauth/token';



const getOauthToken = async () => {
    return new Promise(async function (resolve, reject) {
        try {
            let oauth2_token = new ClientOAuth2({
                clientId: client_id,
                clientSecret: client_secret,
                accessTokenUri: accessTokenUri,
            });
            oauth2_token.credentials.getToken().then(function (user) {
                let oauthToken = user.data.access_token;
                resolve(oauthToken);
            });
        } catch (error) {
            console.log('error', error);
            reject();
        }
    });
};


const main = async () => {
    let oauth2_token = await getOauthToken();
    let extracted_data;
    let resume_data;
    try {
        extracted_data = fs.readFileSync("Archan_2023.pdf");
    } catch (err) {
        console.error("Error reading the PDF file:", err);
        return;
    }

    try {
        let data = await pdf_extraction(extracted_data);
        resume_data = data.text;
    } catch (err) {
        console.error("Error extracting text from PDF:", err);
    }
    const axios = require('axios');
    let data = JSON.stringify({
        "messages": [
            {
                "role": "user",
                "content": resume_data + 'Please convert the above resume into json format which has fields name as primaryEmail, contactEmail, firstName, middleName, lastName, cellPhone, homePhone, address, address2, address3, address4, city, country, candCountry, state, zip, candCurrentTitle, candCurrentCompany(only name dont give . or any charector after name),candComments(any summary by candiadte like short cv summary if given),formerEmployee(this column will check whether candiadte has work in l&t or ltimindtree early if yes return true or else retutn false),education(last education),Skills.'
            }
        ],
        "max_tokens": 3000,
        "temperature": 0,
        "frequency_penalty": 0,
        "presence_penalty": 0,
        "stop": "null"
    });

    let config = {
        method: 'post',
        url: 'https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com/v2/inference/deployments/db4893245053db9f/chat/completions?api-version=2023-05-15',
        headers: {
            'AI-Resource-Group': 'default',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + oauth2_token
        },
        data: data
    };



    axios.request(config)
        .then((response) => {

            var stringd = JSON.stringify(response.data.choices);
            //console.log(stringd)
            var jsonArray = JSON.parse(stringd);
            var contentString = jsonArray[0].message.content;
            var contentObject = JSON.parse(contentString);

            var array = Object.entries(contentObject).map(([key, value]) => ({ [key]: value }));
            function transformArrayToObject(array) {
                let obj = {};
                array.forEach(item => {
                    let key = Object.keys(item)[0];
                    obj[key] = item[key];
                });
                return obj;
            }

            var arr2 = transformArrayToObject(array);

            var syntaxarr = {
                "matching": [
                    { "Sid": "0", "matchingPercentage": 0 }
                ]
            };
            arr2.matching = syntaxarr.matching;





            var iNum = Math.floor(Math.random() * 1000) + 1;
            var snum = String(iNum)
            arr2.personalId = snum;
            //console.log(arr2);

            console.log(arr2);
            let configlti = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://larsen---toubro-infotech-ltd-dev-business-ai-larsento02t1-srv.cfapps.eu10.hana.ondemand.com/v2/odata/v4/cpmaster/Candidates_Details',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: arr2
            };

            axios.request(configlti)
                .then((response) => {
                    console.log("data is succesfully uploaded");
                })
                .catch((error) => {
                    console.log(error);
                });
        })
        .catch((error) => {
            console.log(error);
        });
};

main();