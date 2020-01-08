const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const URL =
        'https://live.euronext.com/nl/product/indices/NL0000249274-XAMS?fbclid=IwAR0XPlPe2GlQaOZ4OpBTFa1S6H30H_LB8ap9cct7Onu2RC0uwqp8VtSdOfU';

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 1080
    })
    await page.goto(URL, { wait: 'networkidle2' });
    await page.waitForSelector('#AwlHistoricalPriceTable')

    const result = await page.evaluate(() => {
        const table  = document.querySelector('#AwlHistoricalPriceTable');
        const numRows = table.rows.length
        let data = "";
        for (let i = 1; i < numRows; i++)
        {
            splitRow = table.rows[i].innerText.split('\t');
            for (let j = 0; j < splitRow.length - 1; j++)
            {
                data += splitRow[j] + ' '
            }
            data += splitRow[splitRow.length-1] + '\n'
        }
        return data;
    });
    browser.close();
    fs.writeFileSync('output.txt', result);
})();
