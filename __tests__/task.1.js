const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const browserOptions = {
    headless: true,
    defaultViewport: null,
    devtools: true,
};
let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch(browserOptions);
    
    page = await browser.newPage();
    await page.goto(`file://${path.resolve(__dirname, '../index.html')}`);
    await page.setViewport({
        width: 1920,
        height: 1080
    });
    
}, 30000);

afterAll(async () => {
    await browser.close();
} );

describe('Background', () => {
    test('page uses `images/pattern.jpg` as background', async () => {
        const imageBackgroundElements = await page.$$eval('*', (els) =>
            els.filter((el) => getComputedStyle(el).backgroundImage.includes('images/pattern.jpg'))
        );
        expect(imageBackgroundElements.length).toBeGreaterThan(0);
    })

    test('background image is used in scaled down form (40% or lower)', async () => {
        const smallBackgroundElements = await page.$$eval('*', (els) =>
            els.filter((el) => parseInt(getComputedStyle(el).backgroundSize) <= 40)
        );
        expect(smallBackgroundElements.length).toBeGreaterThan(0);
    })

    test('background image is used in scaled up form (more than 100%)', async () => {
        const bigBackgroundElements = await page.$$eval('*', (els) =>
            els.filter((el) => parseInt(getComputedStyle(el).backgroundSize) > 100)
        );
        expect(bigBackgroundElements.length).toBeGreaterThan(0);
    })
})