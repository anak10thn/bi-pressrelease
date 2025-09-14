const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    // Get number of iterations from command line argument, default to 10
    const maxIterations = process.argv[2] ? parseInt(process.argv[2]) : 10;
    console.log(`Starting scraper with ${maxIterations} iterations`);

    const browser = await puppeteer.launch({
        headless: false,
        ignoreHTTPSErrors: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    const timeout = 15000;
    page.setDefaultTimeout(timeout);

    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // Navigate to the main page
    await page.goto('https://www.bi.go.id/id/publikasi/ruang-media/news-release/default.aspx', { 
        waitUntil: 'networkidle2',
        timeout: 30000 
    });

    const allLinks = [];
    let iteration = 0;

    while (iteration < maxIterations) {
        console.log(`Processing page ${iteration + 1}`);

        try {
            // Wait for page content to load
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Collect press release links from current page
            const links = await page.evaluate(() => {
                const anchors = document.querySelectorAll('a[href*="/Pages/sp_"]');
                return Array.from(anchors).map(anchor => anchor.href);
            });

            if (links.length > 0) {
                allLinks.push(...links);
                console.log(`Found ${links.length} links on page ${iteration + 1}`);
            } else {
                console.log(`No links found on page ${iteration + 1}`);
            }

            // Try to find and click Next button using the provided selector
            try {
                const nextButton = await puppeteer.Locator.race([
                    page.locator('::-p-aria(Next)'),
                    page.locator('input.next'),
                    page.locator('::-p-xpath(//*[@id="ctl00_ctl54_g_895e8ef2_eaad_4a83_9db7_1632dd8595c0_ctl00_DataPagerSiaranPersList"]/input[2])'),
                    page.locator(':scope >>> input.next')
                ]).setTimeout(timeout);

                if (nextButton) {
                    await nextButton.click();
                    console.log(`Clicked Next button on page ${iteration + 1}`);
                    
                    // Wait for page to load after clicking Next
                    await new Promise(resolve => setTimeout(resolve, 3000));
                } else {
                    console.log('No Next button found, ending scraping');
                    break;
                }
            } catch (error) {
                console.log(`No more Next button found or error clicking: ${error.message}`);
                break;
            }

        } catch (error) {
            console.log(`Error on page ${iteration + 1}: ${error.message}`);
            break;
        }

        iteration++;
    }

    // Remove duplicates and save all links to file
    const uniqueLinks = [...new Set(allLinks)];
    const content = uniqueLinks.join('\n');
    fs.writeFileSync('press-release-bi.txt', content);
    console.log(`Scraping completed! Saved ${uniqueLinks.length} unique links to press-release-bi.txt`);

    await browser.close();
})().catch(err => {
    console.error('Script error:', err);
    process.exit(1);
});