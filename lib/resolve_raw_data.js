/* eslint-disable camelcase */

const TO_REMOVE = "View Friendship";
const TO_MATCH = ['class="_tzn"><a', '_ohe"><a'];

/**
 * Retrieves firstNames and fullNames from the raw_names array 
 *
 * @param {*} raw_names - array of names of birthday profiles in raw format
 * @returns an object that contains an array of firstNames and fullNames
 */
function resolveNames(raw_names) {
  const fullNames = raw_names.split("\n\n");
  /* for (let i = fullNames.length; i--; ) */
  for (let i = fullNames.length - 1; i >= 0; i--) {
    fullNames[i] = fullNames[i].replace("\n", "");
    if (fullNames[i] === TO_REMOVE) {
      fullNames.splice(i, 1);
    }
  }
  const firstNames = [];
  fullNames.forEach(fullName => {
    const nameBreakdown = fullName.split(" ");
    firstNames.push(nameBreakdown[0]);
  });
  return {
    fullNames,
    firstNames
  };
}

/**
 *  Retrieves profileLinks and messageLinks of birthday profiles
 *
 * @param {*} raw_links - array of profile links in raw form
 * @returns an object or arrys of profileLinks and messageLinks
 */
function resolveLinks(raw_links) {
  let profileLinks = [];
  const spaceSeparatedText = raw_links.split(" ");
  for (let i = 0; i < spaceSeparatedText.length; i++) {
    if (TO_MATCH.indexOf(spaceSeparatedText[i]) >= 0) {
      profileLinks.push(
        spaceSeparatedText[i += 1].replace(/href=/g, "").replace(/"/g, "")
      );
    }
  }
  const messageLinks = [];
  profileLinks = profileLinks.map((link, i) => {
    const [newLink] = link.split("?");
    console.log(`profile link: ${newLink}`);
    if (newLink.indexOf("?id") !== -1) {
      messageLinks.push(
        newLink.replace("com/profile.php?id=", "com/messages/t/")
      );
    } else {
      messageLinks.push(newLink.replace("com/", "com/messages/t/"));
    }
    console.log(`messenger link: ${messageLinks[i]}`);
    return newLink;
  });
  /*
  for (let i = 0; i < profileLinks.length; i += 1) {
    profileLinks[i] = profileLinks[i].split("?")[0];
    console.log(`profile link: ${profileLinks[i]}`);
    if (profileLinks[i].indexOf("?id") !== -1) {
      messageLinks.push(
        profileLinks[i].replace("com/profile.php?id=", "com/messages/t/")
      );
    } else {
      messageLinks.push(profileLinks[i].replace("com/", "com/messages/t/"));
    }
    console.log(`messenger link: ${messageLinks[i]}`);
  }
  */
  return {
    profileLinks,
    messageLinks
  };
}

module.exports = { resolveNames, resolveLinks };
