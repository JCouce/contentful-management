const chalk = require('chalk');
const figlet = require('figlet');
const inquirer = require('inquirer');
const child = require('child_process');
const temp = require('tmp');

const colors = {
  light: '#FFF',
  primary: '#63D2FF',
  warning: '#F9E900',
  error: '#FF4365',
};

const print = (text, color) => {
  console.log(chalk.hex(color || colors.light)(text));
};

const error = (text) => {
  const message = text || 'Something went wrong. Closing the toolbox, see you!';
  print(message, colors.error);
};

const warning = (text) => {
  print(text, colors.warning);
};

const headline = (text, color) => {
  return new Promise((res) => {
    figlet(text, (_, result) => {
      print(result, color);
      res();
    });
  });
};

const prompt = inquirer.createPromptModule();

module.exports = {
  print,
  warning,
  error,
  headline,
  prompt,
  child,
  temp,
  colors,
};
