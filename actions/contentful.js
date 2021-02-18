const { createClient } = require('contentful-management');
const { runMigration } = require('contentful-migration');

const ACCESS_TOKEN = 'GioDfLsEpQBdG8tlyFH_pCA5D6WhQS5wnWsOZp0UEXA';
const SPACE_ID = 'pl4vntl1jtvy';

const { print, prompt, error, warning } = require('../utils');
const createMigrationFile = require('../contentful/migration-file');

const initContext = async () => {
  const actions = {
    type: 'list',
    name: 'action',
    message: 'What do you want to do?',
    choices: [
      { title: 'Migrate a new model', value: 'create' },
      { title: 'Update existing model', value: 'update' },
      { title: 'Quit', value: 'quit' },
    ],
  };

  const response = await prompt(actions);
  return response.action;
};

const initContentful = async () => {
  print('Starting Contentful');
  print('Retrieving the Contentful Space');
  const space = await createClient({
    accessToken: ACCESS_TOKEN,
    space: SPACE_ID,
  }).getSpace(SPACE_ID);

  const environments = await space.getEnvironments();
  const develop = environments.items.find((item) => item.name === 'develop');
  const models = await develop.getContentTypes();
  return [environments, models];
};

const mapToChoices = (opts) => {
  if (!Array.isArray(opts)) {
    console.log(typeof opts);
    throw new Error('You are trying to iterate over a non iteratable type');
  }

  return opts.map((item) => ({
    name: item.name,
    value: item,
  }));
};

const selectTargetModel = async (models) => {
  const modelQuestion = {
    type: 'list',
    name: 'model',
    message: 'Select the model to migrate:',
    choices: mapToChoices(models.items),
  };

  const { model } = await prompt(modelQuestion);
  print(`You have selected: ${model.name}`);
  return model;
};

const selectTargetEnvironment = async (environments) => {
  const envQuestion = {
    type: 'list',
    name: 'environment',
    message: 'Select the target environment:',
    choices: mapToChoices(environments.items).filter(
      (env) => env.title !== 'develop'
    ),
  };

  const { environment } = await prompt(envQuestion);
  print(`You have selected: ${environment.name}`);
  return environment;
};

const successMessage = (environment) => {
  warning(
    `You can check the migration here: https://app.contentful.com/spaces/${SPACE_ID}/environments/${environment.name}/content_types`
  );
  print(`Thanks for using the Toolbox, see you next time!`);
};

const create = async () => {
  try {
    const [environments, models] = await initContentful();
    const model = await selectTargetModel(models);
    const environment = await selectTargetEnvironment(environments);
    const migration = await environment.createContentTypeWithId(model.sys.id, {
      name: model.name,
      description: model.description,
      fields: model.fields,
    });

    if (migration) {
      print(
        `${model.name} has been migrated to ${environment.name} successfully`
      );
      warning('IMPORTANT!The model has been migrated as a DRAFT');
      successMessage(environment);
    }
  } catch (e) {
    error(e);
  }
};

const update = async () => {
  try {
    const [environments, models] = await initContentful();

    const model = await selectTargetModel(models);

    const fieldsQuestion = {
      type: 'checkbox',
      name: 'fields',
      message: 'Which fields do you want to update?',
      choices: mapToChoices(model.fields),
      validate: (val) => Array.isArray(val) && val.length > 0,
    };
    const { fields } = await prompt(fieldsQuestion);
    const environment = await selectTargetEnvironment(environments);
    const targetModel = await environment.getContentType(model.sys.id);

    const migrationCallback = async (filePath) => {
      await runMigration({
        filePath,
        accessToken: ACCESS_TOKEN,
        spaceId: SPACE_ID,
        environmentId: environment.sys.id,
      });
    };

    const migration = await createMigrationFile(
      targetModel,
      fields,
      migrationCallback
    );

    if (migration) {
      successMessage(environment);
    }
  } catch (e) {
    error(e);
  }
};

const init = async () => {
  const action = await initContext();
  print(`You have selected: ${action}`);
  switch (action) {
    case 'create':
      await create();
      break;
    default:
    case 'update':
      await update();
      break;
    case 'quit':
      return;
  }
};

module.exports = init;
