const { parse } = require('url');
const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

module.exports = async function (req, res) {
    try {
        const { query = {} } = parse(req.url, true);
        const { url = 'https://nette.org', type = 'png', quality = undefined, fullPage } = query;
        if (!url) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'text/html');
            res.end(`<h1>Bad Request</h1><p>The url <em>${url}</em> is not valid.</p>`);
        } else {
            const file = await getScreenshot(url, type, quality, fullPage);
            res.statusCode = 200;
            res.setHeader('Content-Type', `image/${type}`);
            res.end(file);
        }
    } catch (e) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/html');
        res.end(`<h1>Server Error</h1><p>Sorry, there was a problem: ${e.message}</p>`);
        console.error(e.message);
    }
};

async function getScreenshot(url, type, quality, fullPage) {
    const browser = await puppeteer.launch({
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: chrome.headless,
    });

    const page = await browser.newPage();
    await page.goto(url);
    const file = await page.screenshot({ type, quality, fullPage });
    await browser.close();
    return file;
}
