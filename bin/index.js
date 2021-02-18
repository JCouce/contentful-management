#!/usr/bin/env node

const utils = require('../utils');
const defaultInit = require('../actions/default');
const actions = require('../actions');

const {
  headline,
  error,
  colors: { primary },
} = utils;

(async () => {
  let exitCode = 0;

  try {
    await headline('CG Toolbox', primary);
    const tool = await defaultInit();
    switch (tool) {
      default:
      case 'quit':
        error('Oki Doki, see you next time');
        break;
      case 'contentful':
        await actions.contentful();
    }
  } catch (e) {
    exitCode = 1;
    error(e);
  }

  return process.exit(exitCode);
})();

