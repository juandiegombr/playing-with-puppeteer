const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

const puppeteer = require('puppeteer');

// async function getPic() {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto('https://google.com');
//   await page.screenshot({path: 'google.png'});
//   await browser.close();
// }
// getPic();

let scrape = async () => {
  console.log('scrape')
  const browser = await puppeteer.launch({headless: false})
  const page = await browser.newPage()
  await page.goto('https://news.vuejs.org/')
  // await page.click('.story-title')
  // await page.waitFor(5000);
  
  // Scrape
  
  const result = await page.evaluate(() => {
    let elems = document.querySelectorAll('.story-link')
    let links = []
    elems.forEach((el, i) => {
      const link = elems[i].href
      links.push(link)
    })
    return links
  })
  browser.close();
  return result;
};

let scrapePages = async (links) => {
  console.log(links)
  const browser = await puppeteer.launch({headless: false})
  const page = await browser.newPage()
  let elements = []
  for (let i = 1; i < links.length; i++) {
    let url = links[i]
    // if (url.indexOf('http') !== 0) {
    //   url = url.slice(url.indexOf('http'))
    // }
    console.log(url)
    try {
      await page.goto(`${url}`, {timeout: 10000})
      const result = await page.evaluate(() => {
        let el = document.querySelector('h1').innerText
        let text = []
        let textElements = document.querySelectorAll('p')
        for (let i = 0; i < textElements.length; i++) {
          const el = textElements[i];
          text.push(el.innerText)
        }
        return {title: el} 
      })
      elements.push(result)
    }
    catch (err) {
      console.log('Han pasado 10 segundos')
      // return elements
    }
  }
  browser.close()
  return elements
};

scrape()
  .then((links) => {
    return scrapePages(links)
  })
  .then((value) => {
    console.log('value', value)
  })

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});