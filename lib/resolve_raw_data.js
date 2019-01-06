/* eslint-disable camelcase */

const TO_REMOVE = "View Friendship";
const TO_MATCH = ['class="_tzn"><a', '_ohe"><a'];


function profileToMessageLink(newLink) {
  let tempLink;
  if (newLink.indexOf("?id") !== -1)
    tempLink = newLink.replace("com/profile.php?id=", "com/messages/t/");
  else
    tempLink = newLink.replace("com/", "com/messages/t/");
  const iq = tempLink.indexOf("?");
  if (iq !== -1)
    tempLink = tempLink.substring(0, iq);
  return tempLink;
}


/**
 * Retrieves firstNames and fullNames from the raw_names array 
 *
 * @param {*} raw_names - array of names of birthday profiles in raw format
 * @returns an object that contains an array of firstNames and fullNames
 */
function resolveNames(raw_names) {
  if (raw_names === undefined)
    return {
      fullNames: [],
      firstNames: []
    };
  const fullNames = raw_names.split("\n\n");
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
 * @returns an object of arrys of profileLinks and messageLinks
 */

function resolveLinks(raw_links) {
  if (raw_links === undefined)
    return {
      profileLinks: [],
      messageLinks: []
    };
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
  profileLinks = profileLinks.map((link) => {
    const [newLink] = link.split("&");
    // console.log(`profile link: ${newLink}`);
    const messageLink = profileToMessageLink(newLink);
    messageLinks.push(messageLink);
    // console.log(`messenger link: ${messageLink}`);
    return newLink;
  });

  return {
    profileLinks,
    messageLinks
  };
}

module.exports = { resolveNames, resolveLinks };
