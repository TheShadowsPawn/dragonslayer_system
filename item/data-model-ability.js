/**
 * @file The data model for Items of type Ability
 */
export default class DslDataModelAbility extends foundry.abstract.DataModel {
  static defineSchema() {
    const { StringField, NumberField, BooleanField, ArrayField, ObjectField } =
      foundry.data.fields;
    return {
      save: new StringField(),
      pattern: new StringField(),
      requirements: new StringField(),
      roll: new StringField(),
      rollType: new StringField(),
      rollTarget: new NumberField(),
      blindroll: new BooleanField(),
      description: new StringField(),
      tags: new ArrayField(new ObjectField()),
    };
  }

  get #rollTag() {
    if (!this.roll) return null;

    const rollTarget =
      this.rollTarget === undefined
        ? ""
        : ` ${CONFIG.DSL.roll_type[this.rollType]}${this.rollTarget}`;

    return {
      label: `${game.i18n.localize("DSL.items.Roll")} ${
        this.roll
      }${rollTarget}`,
    };
  }

  get #saveTag() {
    if (!this.save) return null;

    return {
      label: CONFIG.DSL.saves_long[this.save],
      icon: "fa-skull",
    };
  }

  get manualTags() {
    return this.tags || [];
  }

  get autoTags() {
    return [
      ...this.requirements.split(",").map((req) => ({ label: req.trim() })),
      this.#rollTag,
      this.#saveTag,
    ].filter((t) => !!t);
  }
}
