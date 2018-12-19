
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
        await page.goto(LOGIN_URL);
        console.log(
            `login url opened\nfilling entries...\nid: ${fbID}\npass: ${('*').repeat(fbPass.length)}`
        );
        await page.type("#email", fbID);
        await page.type("#pass", fbPass);
        await page.waitFor(1000);
        console.log("entries filled\nlogging in...");
        await page.click("#loginbutton");
        await page.waitFor(10000);
        console.log("successfully logged in");
        return true;
    } catch (error) {
        console.log("LOGIN FAILED!");
        throw new Error(error);
    }
}

module.exports = login;