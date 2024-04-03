/**
 * @file The data model for Items of type Armor
 */
export default class DslDataModelArmor extends foundry.abstract.DataModel {
  static ArmorTypes = {
    unarmored: "DSL.armor.unarmored",
    light: "DSL.armor.light",
    medium: "DSL.armor.light",
    heavy: "DSL.armor.heavy",
    shield: "DSL.armor.shield",
  };

  static defineSchema() {
    const {
      SchemaField,
      StringField,
      NumberField,
      BooleanField,
      ArrayField,
      ObjectField,
    } = foundry.data.fields;
    return {
      type: new StringField({
        initial: "light",
        choices: Object.keys(DslDataModelArmor.ArmorTypes),
      }),
      ac: new SchemaField({
        value: new NumberField({
          initial: 9,
        }),
      }),
      aac: new SchemaField({
        value: new NumberField({
          initial: 10,
        }),
      }),
      description: new StringField(),
      tags: new ArrayField(new ObjectField()),
      equipped: new BooleanField(),
      cost: new NumberField({ min: 0, initial: 0 }),
      containerId: new StringField(),
      quantity: new SchemaField({
        value: new NumberField({ min: 0, initial: 0 }),
        max: new NumberField({ min: 0, initial: 0 }),
      }),
      weight: new NumberField({ min: 0, initial: 0 }),
      itemslots: new NumberField({ min: 0, initial: 1 }),
    };
  }

  get manualTags() {
    if (!this.tags) return null;

    const tagNames = new Set(
      Object.values(CONFIG.DSL.auto_tags).map(({ label }) => label)
    );
    return this.tags
      .filter(({ value }) => !tagNames.has(value))
      .map(({ title, value }) => ({
        title,
        value,
        label: value,
      }));
  }

  get autoTags() {
    const tagNames = Object.values(CONFIG.DSL.auto_tags);

    const autoTags = this.tags.map(({ value }) =>
      tagNames.find(({ label }) => value === label)
    );

    return [
      { label: DslDataModelArmor.ArmorTypes[this.type], icon: "fa-tshirt" },
      ...autoTags,
      ...this.manualTags,
    ]
      .flat()
      .filter((t) => !!t);
  }
}
