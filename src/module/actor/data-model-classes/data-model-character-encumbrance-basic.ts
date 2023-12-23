/**
 * @file A class representing the "Basic" encumbrance scheme from Old School Essentials: Classic Fantasy
 */
import DslDataModelCharacterEncumbrance, {
  CharacterEncumbrance,
} from "./data-model-character-encumbrance";

// import { DSL } from '../../config';

/**
 * A set of options for configuring the
 * Basic encumbrance scheme
 */
type Options = {
  significantTreasure: number;
};

/**
 * @todo Add template path for encumbrance bar
 * @todo Add template path for inventory item row
 */
export default class DslDataModelCharacterEncumbranceBasic
  extends DslDataModelCharacterEncumbrance
  implements CharacterEncumbrance
{
  static templateEncumbranceBar = "";

  static templateInventoryRow = "";

  /**
   * The machine-readable label for this encumbrance scheme
   */
  static type = "basic";

  /**
   * The human-readable label for this encumbrance scheme
   */
  static localizedLabel = "DSL.Setting.EncumbranceBasic";

  /**
   * The base value for the amount of treasure that slows a character down
   */
  static significantTreasure = 800;

  /**
   * A map of strings to numbers indicating how heavy a set of armor is.
   * The heavier the armor, the slower you move.
   */
  static armorWeight = {
    unarmored: 0,
    light: 1,
    heavy: 2,
  };

  #weight;

  #treasureEncumbrance;

  #heaviestArmor;

  constructor(
    max = DslDataModelCharacterEncumbrance.baseEncumbranceCap,
    items: Item[] = [],
    options: Options = {} as Options
  ) {
    super(DslDataModelCharacterEncumbranceBasic.type, max);
    this.#treasureEncumbrance =
      options?.significantTreasure ||
      DslDataModelCharacterEncumbranceBasic.significantTreasure;

    this.#weight = items.reduce(
      (acc: number, { type, system: { treasure, quantity, weight } }: Item) =>
        type !== "item" || !treasure ? acc : acc + quantity.value * weight,
      0
    );

    this.#heaviestArmor = items.reduce(
      (heaviest, { type, system: { type: armorType, equipped } }) => {
        if (type !== "armor" || !equipped) return heaviest;
        if (
          armorType === "light" &&
          heaviest ===
            DslDataModelCharacterEncumbranceBasic.armorWeight.unarmored
        )
          return DslDataModelCharacterEncumbranceBasic.armorWeight.light;
        if (armorType === "heavy")
          return DslDataModelCharacterEncumbranceBasic.armorWeight.heavy;
        return heaviest;
      },
      DslDataModelCharacterEncumbranceBasic.armorWeight.unarmored
    );
  }

  get steps() {
    return [(100 * this.#treasureEncumbrance) / this.max];
  }

  get overTreasureThreshold() {
    return this.value >= this.#treasureEncumbrance;
  }

  get value() {
    return this.#weight;
  }

  get overSignificantTreasureThreshold() {
    return this.value >= this.#treasureEncumbrance;
  }

  get atHalfEncumbered() {
    return (
      this.#heaviestArmor ===
        DslDataModelCharacterEncumbranceBasic.armorWeight.heavy &&
      this.value >= this.#treasureEncumbrance
    );
  }

  get atThreeEighthsEncumbered() {
    const isHeavy =
      this.#heaviestArmor ===
      DslDataModelCharacterEncumbranceBasic.armorWeight.heavy;
    const isLightWithTreasure =
      this.#heaviestArmor ===
        DslDataModelCharacterEncumbranceBasic.armorWeight.light &&
      this.value >= this.#treasureEncumbrance;
    return isHeavy || isLightWithTreasure;
  }

  get atQuarterEncumbered() {
    return (
      this.#heaviestArmor ===
        DslDataModelCharacterEncumbranceBasic.armorWeight.light ||
      this.overSignificantTreasureThreshold
    );
  }
}
