const updatefields = (migration) => {
  const model = migration.editContentType(target.sys.id);

  fields.forEach((field) => {
    const idx = target.fields.findIndex((item) => item.id === field.id);
    const currentField =
      idx !== -1 ? model.editField(field.id) : model.createField(field.id);

    currentField
      .name(field.name)
      .type(field.type)
      .required(field.required)
      .validations(field.validations)
      .localized(field.localized)
      .disabled(field.disabled)
      .omitted(field.ommitted || false)
      .deleted(field.deleted || false);

    if (field.type === 'Array') {
      currentField.items(field.items);
    }

    if (field.type === 'Link') {
      currentField.linkType(field.linkType);
    }
  });
};

module.exports = updatefields;
