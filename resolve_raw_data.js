const TO_REMOVE = 'View Friendship';
const TO_MATCH = ['class="_tzn"><a', '_ohe"><a'];


async function resolveNames(raw_names) {
    const fullNames = raw_names.split('\n\n');
    for (let i=fullNames.length; i--; ){
        fullNames[i] = fullNames[i].replace('\n', '');
        if (fullNames[i] === TO_REMOVE) {
            fullNames.splice(i, 1);
        }
    }
    let firstNames = [];
    fullNames.forEach(fullName => {
        let nameBreakdown = fullName.split(' ');
        firstNames.push(nameBreakdown[0]);
    });
    return {
        fullNames,
        firstNames
    }
}

async function resolveLinks(raw_links){
    let profileLinks = [];
    let spaceSeparatedText = raw_links.split(' ');
    for (let i=0; i<spaceSeparatedText.length; i++){
        if (TO_MATCH.indexOf(spaceSeparatedText[i]) >= 0){
            profileLinks.push(spaceSeparatedText[++i].replace(/href=/g, '').replace(/\"/g, ''))
        }
    }
    let messageLinks = [];
    for (let i=0; i<profileLinks.length; i++){
        if (profileLinks[i].indexOf('id') !== -1) {
            messageLinks.push(profileLinks[i].replace('com/profile.php?id=', 'com/messages/t/'));
        } else{
            messageLinks.push(profileLinks[i].replace('com/', 'com/messages/t/'));
        }
    }

    return {
        profileLinks,
        messageLinks
    };
}


module.exports = {resolveNames, resolveLinks};