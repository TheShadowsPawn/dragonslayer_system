/**
 * @file System-wide configuration settings. Should be reachable elsewhere in the system at `CONFIG.DSL`
 */
import DslDataModelCharacterEncumbranceBasic from "./actor/data-model-classes/data-model-character-encumbrance-basic";
import DslDataModelCharacterEncumbranceComplete from "./actor/data-model-classes/data-model-character-encumbrance-complete";
import DslDataModelCharacterEncumbranceDetailed from "./actor/data-model-classes/data-model-character-encumbrance-detailed";
import DslDataModelCharacterEncumbranceDisabled from "./actor/data-model-classes/data-model-character-encumbrance-disabled";
import DslDataModelCharacterEncumbranceItemBased from "./actor/data-model-classes/data-model-character-encumbrance-item-based";

export type DslConfig = typeof DSL;

export type Attribute = keyof DslConfig["scores"];
export type ExplorationSkill = keyof DslConfig["exploration_skills"];
export type RollType = keyof DslConfig["roll_type"];
export type Save = keyof DslConfig["saves_long"];
export type Armor = keyof DslConfig["armor"];
export type Color = keyof DslConfig["colors"];
export type InventoryItemTag = keyof DslConfig["tags"];
export type EncumbranceOption = keyof DslConfig["encumbranceOptions"];
export type ApplyDamageOption = keyof DslConfig["apply_damage_options"];

export const DSL = {  
  /** Path for system dist */
  systemPath(): string {
    return `${this.systemRoot}/dist`;
  },  
  /** Root path for DSL system */
  get systemRoot(): string {
    return `/systems/${game.system.id}`;
  },
  /** Path for system assets */
  get assetsPath(): string {
    return `${this.systemRoot}/assets`;
  },
  get encumbrance() {
    const variant = game.settings.get(game.system.id, "encumbranceOption");
    return this.encumbranceOptions[variant] || this.encumbranceOptions.disabled;
  },
  encumbranceOptions: {
    basic: DslDataModelCharacterEncumbranceBasic,
    detailed: DslDataModelCharacterEncumbranceDetailed,
    complete: DslDataModelCharacterEncumbranceComplete,
    disabled: DslDataModelCharacterEncumbranceDisabled,
    itembased: DslDataModelCharacterEncumbranceItemBased,
  },
  scores: {
    str: "DSL.scores.str.long",
    int: "DSL.scores.int.long",
    dex: "DSL.scores.dex.long",
    wis: "DSL.scores.wis.long",
    con: "DSL.scores.con.long",
    cha: "DSL.scores.cha.long",
  },
  scores_short: {
    str: "DSL.scores.str.short",
    int: "DSL.scores.int.short",
    dex: "DSL.scores.dex.short",
    wis: "DSL.scores.wis.short",
    con: "DSL.scores.con.short",
    cha: "DSL.scores.cha.short",
  },
  exploration_skills: {
    ld: "DSL.exploration.ld.long",
    od: "DSL.exploration.od.long",
    sd: "DSL.exploration.sd.long",
    fs: "DSL.exploration.ft.long",
  },
  exploration_skills_short: {
    ld: "DSL.exploration.ld.abrev",
    od: "DSL.exploration.od.abrev",
    sd: "DSL.exploration.sd.abrev",
    fs: "DSL.exploration.ft.abrev",
  },
  roll_type: {
    result: "=",
    above: "≥",
    below: "≤",
  },
  saves_short: {
    death: "DSL.saves.death.short",
    wand: "DSL.saves.wand.short",
    paralysis: "DSL.saves.paralysis.short",
    breath: "DSL.saves.breath.short",
    spell: "DSL.saves.spell.short",
  },
  saves_long: {
    death: "DSL.saves.death.long",
    wand: "DSL.saves.wand.long",
    paralysis: "DSL.saves.paralysis.long",
    breath: "DSL.saves.breath.long",
    spell: "DSL.saves.spell.long",
  },
  armor: {
    unarmored: "DSL.armor.unarmored",
    light: "DSL.armor.light",
    heavy: "DSL.armor.heavy",
    shield: "DSL.armor.shield",
  },
  apply_damage_options: {
    selected : "selected",
    targeted : "targeted",
    originalTarget : "originalTarget",
  },
  colors: {
    green: "DSL.colors.green",
    red: "DSL.colors.red",
    yellow: "DSL.colors.yellow",
    purple: "DSL.colors.purple",
    blue: "DSL.colors.blue",
    orange: "DSL.colors.orange",
    white: "DSL.colors.white",
  },
  languages: [
    "Common",
    "Lawful",
    "Chaotic",
    "Neutral",
    "Bugbear",
    "Doppelgänger",
    "Dragon",
    "Dwarvish",
    "Elvish",
    "Gargoyle",
    "Gnoll",
    "Gnomish",
    "Goblin",
    "Halfling",
    "Harpy",
    "Hobgoblin",
    "Kobold",
    "Lizard Man",
    "Medusa",
    "Minotaur",
    "Ogre",
    "Orcish",
    "Pixie",
  ],
  tags: {
    melee: "DSL.items.Melee",
    missile: "DSL.items.Missile",
    slow: "DSL.items.Slow",
    twohanded: "DSL.items.TwoHanded",
    blunt: "DSL.items.Blunt",
    brace: "DSL.items.Brace",
    splash: "DSL.items.Splash",
    reload: "DSL.items.Reload",
    charge: "DSL.items.Charge",
  },
  auto_tags: {
    get melee() {
      return {
        label: CONFIG.DSL.tags.melee,
        image: `${CONFIG.DSL.assetsPath}/melee.png`,
        icon: "fa-sword",
      };
    },
    get missile() {
      return {
        label: CONFIG.DSL.tags.missile,
        image: `${CONFIG.DSL.assetsPath}/missile.png`,
        icon: "fa-bow-arrow",
      };
    },
    get slow() {
      return {
        label: CONFIG.DSL.tags.slow,
        image: `${CONFIG.DSL.assetsPath}/slow.png`,
        icon: "fa-weight-hanging",
      };
    },
    get twohanded() {
      return {
        label: CONFIG.DSL.tags.twohanded,
        image: `${CONFIG.DSL.assetsPath}/twohanded.png`,
        icon: "fa-hands-holding",
      };
    },
    get blunt() {
      return {
        label: CONFIG.DSL.tags.blunt,
        image: `${CONFIG.DSL.assetsPath}/blunt.png`,
        icon: "fa-hammer-crash",
      };
    },
    get brace() {
      return {
        label: CONFIG.DSL.tags.brace,
        image: `${CONFIG.DSL.assetsPath}/brace.png`,
        icon: "fa-block-brick",
      };
    },
    get splash() {
      return {
        label: CONFIG.DSL.tags.splash,
        image: `${CONFIG.DSL.assetsPath}/splash.png`,
        icon: "fa-burst",
      };
    },
    get reload() {
      return {
        label: CONFIG.DSL.tags.reload,
        image: `${CONFIG.DSL.assetsPath}/reload.png`,
        icon: "fa-gear",
      };
    },
    get charge() {
      return {
        label: CONFIG.DSL.tags.charge,
        image: `${CONFIG.DSL.assetsPath}/charge.png`,
        icon: "fa-person-running",
      };
    },
  },
  tag_images: {
    get melee() {
      return `${CONFIG.DSL.assetsPath}/melee.png`;
    },
    get missile() {
      return `fa-bow-arrow`;
    },
    get slow() {
      return `${CONFIG.DSL.assetsPath}/slow.png`;
    },
    get twohanded() {
      return `${CONFIG.DSL.assetsPath}/twohanded.png`;
    },
    get blunt() {
      return `${CONFIG.DSL.assetsPath}/blunt.png`;
    },
    get brace() {
      return `${CONFIG.DSL.assetsPath}/brace.png`;
    },
    get splash() {
      return `${CONFIG.DSL.assetsPath}/splash.png`;
    },
    get reload() {
      return `${CONFIG.DSL.assetsPath}/reload.png`;
    },
    get charge() {
      return `${CONFIG.DSL.assetsPath}/charge.png`;
    },
  },
  monster_saves: {
    0: {
      d: 14,
      w: 15,
      p: 16,
      b: 17,
      s: 18,
    },
    1: {
      d: 12,
      w: 13,
      p: 14,
      b: 15,
      s: 16,
    },
    4: {
      d: 10,
      w: 11,
      p: 12,
      b: 13,
      s: 14,
    },
    7: {
      d: 8,
      w: 9,
      p: 10,
      b: 10,
      s: 12,
    },
    10: {
      d: 6,
      w: 7,
      p: 8,
      b: 8,
      s: 10,
    },
    13: {
      d: 4,
      w: 5,
      p: 6,
      b: 5,
      s: 8,
    },
    16: {
      d: 2,
      w: 3,
      p: 4,
      b: 3,
      s: 6,
    },
    19: {
      d: 2,
      w: 2,
      p: 2,
      b: 2,
      s: 4,
    },
    22: {
      d: 2,
      w: 2,
      p: 2,
      b: 2,
      s: 2,
    },
  },
  monster_thac0: {
    0: 20,
    1: 19,
    2: 18,
    3: 17,
    4: 16,
    5: 15,
    6: 14,
    7: 13,
    9: 12,
    10: 11,
    12: 10,
    14: 9,
    16: 8,
    18: 7,
    20: 6,
    22: 5,
  },
};

export default DSL;
