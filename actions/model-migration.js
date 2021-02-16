const Contentful = require('../utils/contentful-management');
const prompts = require('prompts');
const _chalk = require('chalk');
const Client = Contentful.Client;

const chalk = _chalk.rgb(1, 221, 132);

(async () => {
  try {
    console.log(chalk.bold('Running CG Contentful Model Migration'));
    console.log(chalk('Retrieving the Contentful Space'));
    const space = await Client.getSpace(Contentful.SPACE_ID);

    console.log(chalk('Retrieving Info from develop environment'));
    const originEnvironment = await space.getEnvironment('develop');

    const originModels = await originEnvironment.getContentTypes();

    const modelChoices = originModels.items.map((item) => ({
      title: item.name,
      value: item,
    }));

    const selectedModel = await prompts({
      type: 'select',
      name: 'model',
      message: 'Which Model do you want to migrate?',
      choices: modelChoices,
      validate: (value) => Boolean(value),
    });

    console.log(chalk('Retrieving all the available target environments'));

    const environments = await space.getEnvironments();

    const environmentChoices = environments.items
      .filter((item) => item.name !== 'develop')
      .map((item) => ({
        title: item.name,
        value: item,
      }));

    const selectedEnvironment = await prompts({
      type: 'select',
      name: 'env',
      message: 'Select the destination environment',
      choices: environmentChoices,
      validate: (value) => Boolean(value),
    });

    console.log(
      chalk.bold(`You have selected: ${selectedModel.model.name.toUpperCase()}`)
    );
    console.log(
      chalk.bold(
        `Moving Model to ${selectedEnvironment.env.name.toUpperCase()}`
      )
    );

    const migration = await selectedEnvironment.env.createContentTypeWithId(
      selectedModel.model.sys.id,
      {
        name: selectedModel.model.name,
        description: selectedModel.model.description,
        fields: selectedModel.model.fields,
      }
    );

    if (migration) {
      console.log(
        chalk(
          `${selectedModel.model.name} has been migrated to ${selectedEnvironment.env.name}`
        )
      );
      console.log(
        _chalk.red.bold(
          'IMPORTANT: The Model has been saved as a draft. Validate in Contentful and publish :)'
        )
      );
    }
  } catch (e) {
    console.error(_chalk.red.bold('uh oh! Something went wrong'));
    console.log(e);
  }
})();
