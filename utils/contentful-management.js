const Contentful = require('contentful-management');
const ACCESS_TOKEN = 'GioDfLsEpQBdG8tlyFH_pCA5D6WhQS5wnWsOZp0UEXA';
const SPACE_ID = 'pl4vntl1jtvy';
const Client = Contentful.createClient({
  accessToken: ACCESS_TOKEN,
  space: SPACE_ID,
});

module.exports = {
  Client,
  SPACE_ID,
};
