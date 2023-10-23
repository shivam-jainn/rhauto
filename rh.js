const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  // Launch a headless browser
  const browser = await puppeteer.launch();

  // Open a new page
  const page = await browser.newPage();

  // Navigate to the web page you want to scrape
  await page.goto('https://org.devfolio.co/reva-hack-1/review'); // Replace with your desired URL

  // Wait for the element to appear (adjust timeout as needed)
  try {
    const selector = 'div span.sc-fznZeY.dGgWNh + p.sc-fzqAbL.hNAwHp'; // Selector for the desired element
    await page.waitForSelector(selector, { timeout: 5000 });

    // Get the text content of the element
    const elementText = await page.$eval(selector, (element) => element.textContent);

    // Output the text to a CSV file
    fs.writeFileSync('output.csv', elementText, 'utf8');
    console.log('Data saved to output.csv');
  } catch (error) {
    console.log('Element not found or operation timed out.');
  }

  const autoScroll = async () => {
    await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
        let totalHeight = 0;
        const distance = 100;
        const scrollInterval = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          // If we've scrolled to the bottom, stop scrolling
          if (totalHeight >= scrollHeight) {
            clearInterval(scrollInterval);
            resolve();
          }
        }, 100); // Adjust the interval (in milliseconds) for smoother scrolling.
      });
    });
  };

  // Scroll down to load more content
  await autoScroll();
  
  // Close the browser
  await browser.close();
})();
