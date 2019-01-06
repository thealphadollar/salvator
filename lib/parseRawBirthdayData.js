
const BIRTHDAY_URL = "https://www.facebook.com/events/birthdays/";

/**
 * Goes through the birthdays event page and scrapes raw birthday data of
 * all profiles.
 * 
 * @param {*} page - takes in the puppeteer page object
 * @param {*} spinner - ora cli spinner
 * @returns raw birthday data(contains HTML tags and stuff)
 */
async function parseRawBirthdayData(page, spinner) {
    try {
        spinner.text = `Fetching Birthday Data - opening ${BIRTHDAY_URL}`.green.bold;
        await page.goto(BIRTHDAY_URL);
        await page.waitFor(5000);
        spinner.text = `Fetching Birthday Data - scraping birthday list`.green.bold;
        const results = await page.evaluate(() => {
            const raw_links_selector = document.querySelector(
                "#birthdays_content > div:nth-child(1) > div:nth-child(2) > ul"
            );
            const raw_links = raw_links_selector === null ? undefined : raw_links_selector.innerHTML;
            const raw_names_selector = document.querySelector(
                "#birthdays_content > div:nth-child(1) > div:nth-child(2) > ul"
            );
            const raw_names = raw_names_selector === null ? undefined : raw_names_selector.innerText;
            return {
                raw_links,
                raw_names
            };
        });
        spinner.text = `Fetching Birthday Data - links received`.green.bold;
        await page.close();
        return results;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = parseRawBirthdayData;