const cds = require('@sap/cds');
const { executeHttpRequest } = require('@sap-cloud-sdk/http-client');
const cors = require('cors');
require('dotenv').config();

// ----------------------------------------------------

const fs = require('fs');
const pdf = require('pdf-parse')
const { PDFDocument } = require('pdf-lib');
const axios = require('axios');
const ClientOAuth2 = require('client-oauth2');
const client_secret = 'edf7fec3-428d-4983-b574-536143d70001$I7GPwBkjWwNnKDZmo7PQ3MZ0w4sDNKtO3pOpYKReCZU=';
const client_id = 'sb-b66c3931-8480-4dfd-8108-0992e56cac64!b476474|aicore!b540';
const accessTokenUri = 'https://genai-ltim.authentication.eu10.hana.ondemand.com/oauth/token';
const pdf_extraction = require('pdf-parse-pages');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const base64topdf = require('base64topdf');

// -------------------------------------------------

cds.on('bootstrap', app => {
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
});

async function FetchJobreq() {
  var returnData;
  const destination = {
    url: 'https://api44preview.sapsf.com/odata/v2',
    headers: {
      'Authorization': 'Basic ' + Buffer.from('LTIADMIN@larsento02T1:Ltiadmin@12345').toString('base64')
    }
  };
  try {
    console.log('Basic Auth:', Buffer.from('LTIADMIN@larsento02T1:Ltiadmin@12345').toString('base64'));
    const response = await executeHttpRequest(destination, {
      method: 'GET',
      url: '/JobRequisition?$expand=jobReqLocale,jobReqPostings,lastModifiedByNav,originator,status,hiringManager'
    });



    var odatarespo = response.data.d.results;
    odatarespo.forEach(item => {

      if (Array.isArray(item.jobReqPostings.results) && item.jobReqPostings.results.length === 0) {
        //console.log("values are empty");
        item.jobReqPostings.results = [{ "postEndDate": "/Date(1732387200000)/" }];
      }

      if (item.jobReqPostings.results[0].postEndDate === null) {
        item.jobReqPostings.results[0].postEndDate = "/Date(1732387200000)/";
      }

    })


    // Get the current date in milliseconds
    var currentDate = new Date().getTime();

    const filteredData = odatarespo.filter(entry => {
      //console.log(entry.jobReqPostings.results[0].postEndDate)
      var date = parseInt(entry.jobReqPostings.results[0].postEndDate.match(/\d+/)[0]);
      return date >= currentDate;
      //return Date(entry.jobReqPostings.results[0].postEndDate) >= TodayDate 
    });
    returnData = filteredData;
  } catch (error) {
    console.error('Error fetching data:', error);

  }
  //console.log(returnData);
  return returnData;
};
async function FetchJRD() {
  var returnData;
  const destination = {
    url: 'https://api44preview.sapsf.com/odata/v2',
    headers: {
      'Authorization': 'Basic ' + Buffer.from('LTIADMIN@larsento02T1:Ltiadmin@12345').toString('base64')
    }
  };
  try {
    console.log('Basic Auth:', Buffer.from('LTIADMIN@larsento02T1:Ltiadmin@12345').toString('base64'));
    const response = await executeHttpRequest(destination, {
      method: 'GET',
      url: '/JobRequisition?$expand=jobReqLocale,jobReqPostings'
    });



    var odatarespo = response.data.d.results;
    odatarespo.forEach(item => {

      if (Array.isArray(item.jobReqPostings.results) && item.jobReqPostings.results.length === 0) {
        //console.log("values are empty");
        item.jobReqPostings.results = [{ "postEndDate": "/Date(253400572800000)/" }];
      }

      if (item.jobReqPostings.results[0].postEndDate === null) {
        item.jobReqPostings.results[0].postEndDate = "/Date(253400572800000)/";
      }



    })


    // Get the current date in milliseconds
    var currentDate = new Date().getTime();

    const filteredData = odatarespo.filter(entry => {
      //console.log(entry.jobReqPostings.results[0].postEndDate)
      var date = parseInt(entry.jobReqPostings.results[0].postEndDate.match(/\d+/)[0]);

      return date >= currentDate;
      //return Date(entry.jobReqPostings.results[0].postEndDate) >= TodayDate 
    });

    //console.log(filteredData);
    returnData = filteredData;
  } catch (error) {
    console.error('Error fetching data:', error);

  }
  //console.log(returnData);
  return returnData;
};

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


module.exports = cds.service.impl(async function () {

  var odata2;


  this.on('CompareCDwithSF', async (req) => {
    var pid = req.data.pid;
    console.log(pid);
    console.log(typeof (pid));
    const destination = {
      url: 'https://api44preview.sapsf.com/odata/v2',
      headers: {
        'Authorization': 'Basic ' + Buffer.from('LTIADMIN@larsento02T1:Ltiadmin@12345').toString('base64')
      }
    };
    try {
      console.log('Basic Auth:', Buffer.from('LTIADMIN@larsento02T1:Ltiadmin@12345').toString('base64'));
      const response = await executeHttpRequest(destination, {
        method: 'GET',
        url: '/Candidate'
      });



      var odata1 = response.data.d;
      try {
        // Access the CDS service
        const service = await cds.connect.to('CPMaster');

        // Define the query
        const query = SELECT.from('Candidates_Details').where("personalId=" + "'" + pid + "'");

        // Execute the query
        odata2 = await service.run(query);

        // Handle the data
        //console.log(odata2);



      } catch (error) {
        console.error('Error fetching data:', error);

      }


      //console.log(odata1)
      console.log(odata2)

      function calculateMatchingPercentage(odata1, odata2) {
        let matchingPercentage = 0;
        if (odata1.firstName === odata2.firstName && odata1.lastName === odata2.lastName) {
          matchingPercentage += 6;
          if (odata1.primaryEmail === odata2.primaryEmail) matchingPercentage += 31;
          if (odata1.contactEmail === odata2.contactEmail) matchingPercentage += 13;
          if (odata1.address === odata2.address) matchingPercentage += 3;
          if (odata1.city === odata2.city) matchingPercentage += 8;
          if (odata1.country === odata2.country) matchingPercentage += 10;
          if (odata1.currentTitle === odata2.candCurrentTitle) matchingPercentage += 12;
          if (odata1.currentCompany === odata2.candCurrentCompany) matchingPercentage += 17;
        }
        return matchingPercentage;
      }
      // console.log(odata1)

      odata1.results.forEach(entry1 => {
        odata2.forEach(entry2 => {

          let matchingPercentage = calculateMatchingPercentage(entry1, entry2);
          if (matchingPercentage > 0) {
            entry2.matching.push({ Sid: entry1.candidateId, matchingPercentage: matchingPercentage });
          }
          entry2.matching = entry2.matching.filter(entry => entry.matchingPercentage !== 0);

        });


      });
      var shubh = {};
      shubh.results = odata2;
      //console.log(shubh)
      return shubh;
    } catch (error) {
      console.error('Error during request to remote service:', error.response ? error.response.data : error.message);
      console.error('Stack:', error.stack);
      throw new Error('Failed to fetch data from external service');
    }


    //  return SELECT.from(response1);

  });
  // *****************************************************************************************
  this.on('FetchJRData', async (req) => {

    var odata = FetchJobreq();
    return odata;

  }),

    // *****************************************************************************************
    this.on('MatchingCandidate', async (req) => {
      var Jid = req.data.Jid;
      var unfilteredData = await FetchJobreq();
      var filteredData = unfilteredData.filter(entry => entry.jobReqId === Jid);
      var jobdescription = filteredData[0].jobReqLocale.results[0].jobDescription;
      var CDodata;
      var finaloutput;
      if (jobdescription == null) {
        jobdescription = "job description is not available";
      }
      console.log(jobdescription);
      try {
        // Access the CDS service
        const service = await cds.connect.to('CPMaster');

        // Define the query
        const query = SELECT.from('Candidates_Details');

        // Execute the query
        odata2 = await service.run(query);

        // Handle the data
        //console.log(odata2);
        CDodata = odata2;

      } catch (error) {
        console.error('Error fetching data:', error);

      }

      let oauth2_token = await getOauthToken();
      let data = JSON.stringify({
        "messages": [
          {
            "role": "user",
            // "content": "I have an array of candidate profiles. Each candidate has the following attributes: full name, skills, experience, and education. I also have a job description in the form of a string inside HTML tags. Your task is to: 1. Extract relevant information from the job description (skills, years of experience, and education level). 2. Compare each candidate's skills, experience, and education with the extracted information. 3. Return a JSON object with three fields: personalId: the personalId of the best-matching candidate (from the candidates array), fullName: the full name of the best-matching candidate, and overview: a brief overview of which skills, experience, and education from the job description matched with the candidate, formatted in HTML tags. Do not include any code blocks or additional formatting like '```json'. Return the response as plain JSON. Here are the candidate profiles and the job description: const candidates = " + JSON.stringify(CDodata) + "; const jobDescription = " + jobdescription + ". If the value of jobDescription is 'job description is not available', return the JSON format and give only overview as '<H2>No Candidate Matches as job description is empty</H2>' ."
            "content": JSON.stringify(CDodata) + "These are the Json array of candidate profiles. Each candidate has the following attributes: full name, skills, experience, and education and Below is the JOB description which is inside the html tags:" + jobdescription + ",only if  candidate is match with job description,Then give me the Overview of Matches in HTML Tags because i am going to use it in direct in ui.dont give non matching candidate. also give the number of candidate, give this both in json format in one filed the overview and other filed the number of matched candidate and in new filed named as 'matches' give the separate overview in points in html tags also include name of candidate inside that named 'matchOverview' for matching for each candidate with the personalId in new josn field i am going to use this overview in ui as card so give html tags according to that with font size of h4 dont give heading like 'Overview for Candiadte' inside matchs overview and one more json field you can add as best matching candidate named as 'bestMatchingCandidate'for only name of best matching candidate named as 'BestName', tip dont give all heading inside h1 tag give it inside h4 tags and title inside strong tags. "
          }
        ],
        "max_tokens": 3000,
        "temperature": 0,
        "frequency_penalty": 0,
        "presence_penalty": 0,
        "stop": "null"
      });
      // console.log(data)
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

      await axios.request(config)
        .then((response) => {
          //finaloutput = response.data.choices[0].message.content;
          console.log(response);
          var stringd = JSON.stringify(response.data.choices);
          console.log(stringd)
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

          finaloutput = transformArrayToObject(array);
          //finaloutput = contentString;


        })
        .catch((error) => {
          console.log(error);
        });

      return finaloutput
    });

  // *****************************************************************************************

  this.on('AddNewCandi', async (req) => {
    let extracted_data;
    let resume_data;

    async function getAccessToken() {
      const response = await fetch('https://ltimbuildcode.authentication.eu10.hana.ondemand.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          'grant_type': 'client_credentials',
          'client_id': 'sb-e6e25729-e78b-4394-99b6-de60f9f6dbd8!b501977|sdm-di-SDM_DI_PROD-prod!b41064',
          'client_secret': 'GBaB/LAoiHK2g7YII0aMOgxcbek='
        })
      });

      if (!response.ok) {
        console.error('Failed to fetch access token:', response.status, response.statusText);
        throw new Error('Failed to fetch access token');
      }

      const data = await response.json();
      return data.access_token;
    }

    async function fetchpdfKeys() {
      try {
        const token = await getAccessToken();
        const response = await fetch('https://api-sdm-di.cfapps.eu10.hana.ondemand.com/browser/cb8e4807-7cd1-453f-92cd-8b6447255141/root/MailAttachments', {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });

        if (!response.ok) {
          console.error('Failed to fetch data:', response.status, response.statusText);
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        console.log('Data:', data);
        const keyvalues = data.objects.map(obj => obj.object.properties["cmis:objectId"].value);
        return keyvalues;
      } catch (error) {
        console.error("Error while fetching pdf keys:", error);
        return error;
      }
    }

    async function fetchpdfData(keyvalues) {
      try {
        console.log(keyvalues);
        const url = `https://api-sdm-di.cfapps.eu10.hana.ondemand.com/browser/cb8e4807-7cd1-453f-92cd-8b6447255141/root/MailAttachments?objectId=${keyvalues}`;
        console.log(url);
        const tokenone = await getAccessToken();

        const response = await fetch(url, {
          method: 'GET',
          responseType: 'arraybuffer',
          headers: {
            'Authorization': 'Bearer ' + tokenone,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          console.error('Failed to fetch PDF data:', response.status, response.statusText);
          throw new Error('Failed to fetch PDF data');
        }

        const buffer = Buffer.from(await response.arrayBuffer());
        const pdata = await pdf(buffer);
        const extractedText = pdata.text;

        let requestData = JSON.stringify({
          "messages": [
            {
              "role": "user",
              "content": extractedText + 'Please convert the above resume into json format which has fields name as primaryEmail, contactEmail, firstName, middleName, lastName, cellPhone, homePhone, address, address2, address3, address4, city, country, candCountry, state, zip, candCurrentTitle, candCurrentCompany(only name dont give . or any charector after name),candComments(any summary by candiadte like short cv summary if given),formerEmployee(this column will check whether candiadte has work in l&t or ltimindtree early if yes return true or else retutn false),education(last education),Skills(should be in single string within html tags which must be in list or butles so i can directly convert this html text to my ui rememeber that tags should start with html then side anytags you want).'
            }
          ],
          "max_tokens": 3000,
          "temperature": 0,
          "frequency_penalty": 0,
          "presence_penalty": 0,
          "stop": "null"
        });

        async function sendAjaxRequest(url, method, headers, data) {
          return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            for (const key in headers) {
              xhr.setRequestHeader(key, headers[key]);
            }
            xhr.onreadystatechange = function () {
              if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                  resolve(JSON.parse(xhr.responseText));
                } else {
                  reject(xhr.statusText);
                }
              }
            };
            xhr.send(data);
          });
        }

        let oauth2_tokennew = await getOauthToken();
        try {
          let response = await sendAjaxRequest(
            'https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com/v2/inference/deployments/db4893245053db9f/chat/completions?api-version=2023-05-15',
            'POST',
            {
              'AI-Resource-Group': 'default',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + oauth2_tokennew
            },
            requestData
          );

          var contentString = response.choices[0].message.content;
          var contentObject = JSON.parse(contentString);

          var array = Object.entries(contentObject).map(([key, value]) => ({ [key]: value }));
          function transformArrayToObject(array) {
            let obj = {};
            array.forEach(item => {
              let key = Object.keys(item);
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
          var pnumber;
          try {
            // Access the CDS service
            const service = await cds.connect.to('CPMaster');

            // Define the query
            const query = SELECT.one.columns`personalId`.from('Candidates_Details').orderBy`personalId desc`;

            // Execute the query
            pnumber = await service.run(query);
            //console.log(pnumber);
          } catch (error) {
            console.error('Error fetching data:', error);

          }

          var newid = parseInt(pnumber.personalId) + 1;
          console.log(newid);
          arr2.personalId = newid.toString();

          const today = new Date();
          const day = String(today.getDate()).padStart(2, '0');
          const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
          const year = today.getFullYear();

          const formattedDate = `${day}/${month}/${year}`;
          console.log(formattedDate);
          arr2.CreatedDate = formattedDate;

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

          try {
            let ltiResponse = await axios.request(configlti);
            console.log("Data successfully uploaded:", ltiResponse.data);

            const purl = `https://api-sdm-di.cfapps.eu10.hana.ondemand.com/browser/cb8e4807-7cd1-453f-92cd-8b6447255141/root/MailAttachments`;
            const urlencoded = new URLSearchParams();
            urlencoded.append("cmisaction", "move");
            urlencoded.append("objectId", keyvalues);
            urlencoded.append("sourceFolderId", "262XLnJekPJjugfG8ViExorgLFY6XpltaqzYbl7Bgx4");
            urlencoded.append("targetFolderId", "QowxxNbtwTbUkOedXK87iWdyQcJsvNna-w5f81cm3iU");
            const postresponse = await fetch(purl, {
              method: 'POST',
              headers: {
                'Authorization': 'Bearer ' + tokenone,
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              body: urlencoded
            });

            // if (!postresponse.ok) {
            //   console.error('Failed to delete data of DMS:', postresponse.status, postresponse.statusText);
            //   throw new Error('Failed to delete data of DMS');
            // }

            var crosscheck = await postresponse.json();
            console.log(crosscheck);

            return "Data successfully uploaded";
          } catch (error) {
            console.error("Error uploading data:", error);
            return "Error uploading data: " + error;
          }
        } catch (error) {
          console.error("Error in AI request:", error);
          return "Error in AI request: " + error;
        }
      } catch (error) {
        console.error("Error while fetching PDF data:", error);
        return "Error while fetching PDF data: " + error;
      }
    }


    async function main() {
      try {
        const fk = await fetchpdfKeys();
        if (Array.isArray(fk) && fk.length === 0) {
          console.log("No new CVs are added in DMS");
          return "No new CVs are added in DMS";
        } else {
          var resultdata = '';
          for (const Ikey of fk) {
            const fd = await fetchpdfData(Ikey);
            console.log(fd);
            resultdata += fd;
          }
          return resultdata;
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    let finalresponse = await main();
    return finalresponse;
  });

  //******************************************************************************************//

  this.on('DataSummary', async (req) => {
    var JRD = await FetchJobreq();
    var arr = [];
    var CDodata = [];
    var newstring = [];

    JRD.forEach(function (p) {
      if (p.jobReqLocale.results[0].jobDescription != null) {
        var newdata = {
          jobReqId: p.jobReqId,
          postEndDate: p.jobReqPostings.results[0].postEndDate,
          jobDescription: p.jobReqLocale.results[0].jobDescription
        };
        arr.push(newdata);
      }
    });

    try {
      // Access the CDS service
      const service = await cds.connect.to('CPMaster');

      // Define the query
      const query = SELECT.from('Candidates_Details');

      // Execute the query
      const odata2 = await service.run(query);

      // Handle the data
      odata2.forEach(item => {
        var tempCDodata = {
          "firstname": item.firstName,
          "lastname": item.lastName,
          "skills": item.Skills,
          "overview": item.candComments
        };
        CDodata.push(tempCDodata);
      });

    } catch (error) {
      console.error('Error fetching data:', error);
    }

    let oauth2_token = await getOauthToken();

    async function finaldataout() {
      for (const jditem of arr) {
        console.log(jditem);
        let data = JSON.stringify({
          "messages": [
            {
              "role": "user",
              "content": "I have two arrays: Candidate Data:" + JSON.stringify(CDodata) + "const jobDescription = " + JSON.stringify(jditem) + " . I need a JSON response containing 'jobReqId' from the job post and 'numberOfMatchingCandidates', representing the count of candidates whose skills match any keyword in the job description.tip dont add any other keyword directly give me the json responce becouse iam using it in my code."
            }
          ],
          "max_tokens": 3000,
          "temperature": 0,
          "frequency_penalty": 0,
          "presence_penalty": 0,
          "stop": "null"
        });

        function sendAjaxRequest(url, method, headers, data) {
          return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            for (const key in headers) {
              xhr.setRequestHeader(key, headers[key]);
            }
            xhr.onreadystatechange = function () {
              if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                  resolve(JSON.parse(xhr.responseText));
                } else {
                  reject(xhr.statusText);
                }
              }
            };
            xhr.send(data);
          });
        }

        let response = await sendAjaxRequest(
          'https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com/v2/inference/deployments/db4893245053db9f/chat/completions?api-version=2023-05-15',
          'POST',
          {
            'AI-Resource-Group': 'default',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + oauth2_token
          },
          data
        );

        //var contentString = response.choices[0].message.content;
        // console.log(response);
        var stringd = JSON.stringify(response.choices);
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

        var finaloutput = transformArrayToObject(array);
        console.log(finaloutput);
        newstring.push(finaloutput);
      }
      return newstring;
    }

    async function main() {
      var gg = await finaldataout();
      return gg;
    }

    return await main();
  });





});






