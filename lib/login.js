
/**
 * logins into your fb account using env variables
 *
 * @param {*} page - puppeteer page object
 * @param {*} LOGIN_URL - fabook login page URL
 * @param {*} fbID - account fb id
 * @param {*} fbPass - account fb password
 * @returns true if login was successful else results into an error
 */
async function login(page, LOGIN_URL, fbID, fbPass) {
    try {
        console.log("trying to login...");
        try {
            await page.goto(LOGIN_URL);
        } catch (e) {
            throw new Error("Check your internet connection!");
        }
        console.log(
            `login url opened\nfilling entries...\nid: ${fbID}\npass: ${('*').repeat(fbPass.length)}`
        );
        await page.type("#email", fbID);
        await page.type("#pass", fbPass);
        await page.waitFor(1000);
        console.log("entries filled\nlogging in...");
        await page.click("#loginbutton");
        await page.waitFor(10000);
        console.log(page.url());
        if (page.url() !== 'https://www.facebook.com/')
            throw new Error("Login Failed! Check your Login credentials");
        console.log("successfully logged in");
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = login;