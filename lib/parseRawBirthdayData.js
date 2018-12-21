
const BIRTHDAY_URL = "https://www.facebook.com/events/birthdays/";

/**
 * Goes through the birthdays event page and scrapes raw birthday data of
 * all profiles.
 * 
 * @param {*} page - takes in the puppeteer page object
 * @returns raw birthday data(contains HTML tags and stuff)
 */
async function parseRawBirthdayData(page) {
    try {
        console.log("getting birthdays...");
        await page.goto(BIRTHDAY_URL);
        console.log("birthday page opened\nscraping birthdays...");
        await page.waitFor(5000);
        const results = await page.evaluate(() => {
            const raw_links = document.querySelector(
                "#birthdays_content > div:nth-child(1) > div:nth-child(2) > ul"
            ).innerHTML;
            const raw_names = document.querySelector(
                "#birthdays_content > div:nth-child(1) > div:nth-child(2) > ul"
            ).innerText;
            return {
                raw_links,
                raw_names
            };
        });
        console.log("links received");
        page.close();
        return results;
    } catch (error) {
        console.log("FAILED!");
        throw new Error(error);
    }
}

module.exports = parseRawBirthdayData;