/**
 * @file Wire up system settings.
 */

import { ApplyDamageOption } from "./config";
import { EncumbranceOption } from "./config";

/**
 * Perform setting registration.
 */
const registerSettings = () => {
  game.settings.register(game.system.id, "initiative", {
    name: game.i18n.localize("DSL.Setting.Initiative"),
    hint: game.i18n.localize("DSL.Setting.InitiativeHint"),
    default: "group",
    scope: "world",
    type: String,
    config: true,
    choices: {
      individual: "DSL.Setting.InitiativeIndividual",
      group: "DSL.Setting.InitiativeGroup",
    },
  });

  game.settings.register(game.system.id, "rerollInitiative", {
    name: game.i18n.localize("DSL.Setting.RerollInitiative"),
    hint: game.i18n.localize("DSL.Setting.RerollInitiativeHint"),
    default: "reset",
    scope: "world",
    type: String,
    config: true,
    choices: {
      keep: "DSL.Setting.InitiativeKeep",
      reset: "DSL.Setting.InitiativeReset",
      reroll: "DSL.Setting.InitiativeReroll",
    },
  });

  game.settings.register(game.system.id, "ascendingAC", {
    name: game.i18n.localize("DSL.Setting.AscendingAC"),
    hint: game.i18n.localize("DSL.Setting.AscendingACHint"),
    default: false,
    scope: "world",
    type: Boolean,
    config: true,
  });

  game.settings.register(game.system.id, "morale", {
    name: game.i18n.localize("DSL.Setting.Morale"),
    hint: game.i18n.localize("DSL.Setting.MoraleHint"),
    default: false,
    scope: "world",
    type: Boolean,
    config: true,
  });

  game.settings.register(game.system.id, "encumbranceOption", {
    name: game.i18n.localize("DSL.Setting.Encumbrance"),
    hint: game.i18n.localize("DSL.Setting.EncumbranceHint"),
    default: "detailed",
    scope: "world",
    type: String,
    config: true,
    choices: Object.values(CONFIG.DSL.encumbranceOptions)
    .reduce((obj, enc) => {
      return {...obj, [enc.type]: enc.localizedLabel}
    }, {}) as SettingConfig<EncumbranceOption>["choices"],
  });

  game.settings.register(game.system.id, "significantTreasure", {
    name: game.i18n.localize("DSL.Setting.SignificantTreasure"),
    hint: game.i18n.localize("DSL.Setting.SignificantTreasureHint"),
    default: 800,
    scope: "world",
    type: Number,
    config: true,
  });

  game.settings.register(game.system.id, "languages", {
    name: game.i18n.localize("DSL.Setting.Languages"),
    hint: game.i18n.localize("DSL.Setting.LanguagesHint"),
    default: "",
    scope: "world",
    type: String,
    config: true,
  });
  game.settings.register(game.system.id, "applyDamageOption", {
    name: game.i18n.localize("DSL.Setting.applyDamageOption"),
    hint: game.i18n.localize("DSL.Setting.applyDamageOptionHint"),
    default: "selected",
    scope: "world",
    type: String,
    config: true,
    choices:  {
      selected : game.i18n.localize("DSL.Setting.damageSelected"),
      targeted : game.i18n.localize("DSL.Setting.damageTarget"),
      originalTarget : game.i18n.localize("DSL.Setting.damageOriginalTarget"),
    },
  });
  game.settings.register(game.system.id, "invertedCtrlBehavior", {
    name: game.i18n.localize("DSL.Setting.InvertedCtrlBehavior"),
    hint: game.i18n.localize("DSL.Setting.InvertedCtrlBehaviorHint"),
    default: false,
    scope: "world",
    type: Boolean,
    config: true,
  });
};

declare global {
  namespace ClientSettings {
    // Include DSL settings in addition to foundry default settings
    interface Values {
      "dsl.initiative": "individual" | "group";
      "dsl.rerollInitiative": "keep" | "reset" | "reroll";
      "dsl.ascendingAC": boolean;
      "dsl.morale": boolean;
      "dsl.encumbranceOption": EncumbranceOption;
      "dsl.significantTreasure": number;
      "dsl.languages": string;
      "dsl.applyDamageOption": ApplyDamageOption;
    }
  }
}

export default registerSettings;
