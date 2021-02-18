const utils = require('../utils');

const { prompt, print, colors } = utils;

const questions = {
  type: 'list',
  name: 'action',
  message: 'Select the tool you want to use:',
  choices: [
    { name: 'Contentful', value: 'contentful' },
    { name: 'Forget about, just quit', value: 'quit' },
  ],
};

const init = async () => {
  try {
    const response = await prompt(questions);
    return response.action;
  } catch {}
};

module.exports = init;
