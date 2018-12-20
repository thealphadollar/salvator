/**
 *  Creates a randomized birthday wish for the given firstname of person
 *
 * @param {*} [firstName=undefined]
 * @returns
 */
function genWish(firstName = undefined) {
    const wishes = [
        "Happy Birthday !!",
        "Happy Birthday! Have a blast.",
        "Many more happy returns of the day",
        "I wish you all the happiness in the world! Happy Birthday.",
        "Just live it out to the fullest and have fun! Happy Birthday",
        "I hope you have the best day ever. Happy Birthday!",
        "Happy Birthday!! May all of your birthday wishes come true.",
        "Happy Birthday! Welcome to the new age."
    ];

    const randomnumber = Math.floor(Math.random() * wishes.length);
    if (firstName) {
        return `Hey ${firstName} ${wishes[randomnumber]}`;
    }
    return `Hey! ${wishes[randomnumber]}`;
}

module.exports = genWish;