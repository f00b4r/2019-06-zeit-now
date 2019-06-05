const { parse } = require('url');
const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

module.exports = async function (req, res) {
    const { query = {} } = parse(req.url, true);
    const { url = 'https://nette.org', fullPage } = query;

    const file = await (async () => {
        const browser = await puppeteer.launch({
            args: chrome.args,
            executablePath: await chrome.executablePath,
            headless: chrome.headless,
        });

        const page = await browser.newPage();
        await page.goto(url);
        const file = await page.screenshot({ type: 'png', fullPage });
        await browser.close();
        return file;
    })();

    res.statusCode = 200;
    res.setHeader('Content-Type', `image/png`);
    res.end(file);
};
