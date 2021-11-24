const express = require('express');
const quest = require('request');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
var cors = require('cors')
let port = process.env.PORT || 3000

const app = express();

app.use(cors())

app.listen(port, ()=>{
    console.log('Listening at ',port);
})

//ROUTES



// Details
app.get('/playlist', (request, response) => {
    console.log(request.query.link);
    getPlaylist(request.query.link).then((data)=>{
        response.send(data) 
    }).catch(console.error);
});

app.get('/song', (request, response) => {
    console.log(request.query.link);
    getASong(request.query.link).then((data)=>{
        response.send(data) 
    }).catch(console.error);
});




//FUNCTIONS
function getPlaylist (link) {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch({
                headless:true,
                args: [
                  '--no-sandbox',
                  '--disable-setuid-sandbox',
                ],
              });
            const page = await browser.newPage();
            page.setDefaultTimeout(60000)
            await page.goto(`https://www.youtube.com/playlist?list=PLKQ0g8HhSxnd5NiWycFLyUNvZueTwLGrG`, {waitUntil: 'networkidle2'});
            
            const selectorA = "a.yt-simple-endpoint.ytd-playlist-video-renderer"

            await page.waitForSelector(selectorA)
              
 const items = await page.$$eval(selectorA, rows => {
        console.log("eval " + rows);
        return rows.map(row => (
            {
            artist : row.innerText.split('-')[0],
            title : row.innerText.split('-')[1],
            link : row.href,
            id : row.href.split('=')[1].split('&')[0]
             })
             
             );
    });


            browser.close();
            return resolve(items);
        } catch (e) {
            return reject(e);
        }
    })
}

function getASong (link) {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch({
                headless:true,
                args: [
                  '--no-sandbox',
                  '--disable-setuid-sandbox',
                ],
              });
            const page = await browser.newPage();
            page.setDefaultTimeout(60000)
            await page.goto(`https://www.youtube.com/watch?v=T9Jcs45GhxU`, {waitUntil: 'networkidle2'});
            
            const selectorA = "h1>yt-formatted-string.ytd-video-primary-info-renderer.style-scope"

            await page.waitForSelector(selectorA)
              
 const items = await page.evaluate(() => {
       let artist = document.querySelector("h1>yt-formatted-string.ytd-video-primary-info-renderer.style-scope").innerText.split('-')[0]
       let title = document.querySelector("h1>yt-formatted-string.ytd-video-primary-info-renderer.style-scope").innerText.split('-')[1]
       return {
           artist,
           title
       }
        
    });


            browser.close();
            console.log('Done');
            return resolve(items);
        } catch (e) {
            return reject(e);
        }
    })
}

