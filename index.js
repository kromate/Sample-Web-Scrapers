const express = require('express');
const puppeteer = require('puppeteer');
var cors = require('cors')
let port = process.env.PORT || 3000

const app = express();

app.use(cors())

//ROUTES


// Details
app.get('/details', (request, response) => {
    console.log(request.query.link);
    getdetails(request.query.link).then((data)=>{
        response.send(data) 
    }).catch(console.error);
});



app.listen(port)

//FUNCTIONS

let extractEmails = ( text ) => {
    return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
    }


function getdetails (link) {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch({
                args: [
                  '--no-sandbox',
                  '--disable-setuid-sandbox',
                ],
              });
            const page = await browser.newPage();
            await page.goto(`https://www.instagram.com/${link}`, {waitUntil: 'networkidle2'});
            await page.waitForSelector('div.-vDIg',{visible: true})
            
            let urls = await page.evaluate(() => {
                let results = {}
                if(document.querySelector('.rhpdm')){
                    let text = document.querySelector('.rhpdm')?.innerText;
                    let extra = document.querySelector('.-vDIg > span')?.innerText;
                    if(extra){
                        const emailCheck = extra.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);

                        let email = emailCheck ? emailCheck : 'No email Found'

                        results ={user:text, email:email}
                    }
                     
                }
                
               
                return results;
            })
            browser.close();
            return resolve(urls);
        } catch (e) {
            return reject(e);
        }
    })
}

