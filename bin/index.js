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
  try {
    await headline('CG Toolbox', primary);
    const tool = await defaultInit();
    switch (tool) {
      default:
      case 'quit':
        error('Oki Doki, see you next time');
        return process.exit(0);
      case 'contentful':
        await actions.contentful();
    }
  } catch (e) {
    error(e);
  }
})();
