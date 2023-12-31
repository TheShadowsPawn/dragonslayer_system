/**
 * @file A class representing the "Detailed" encumbrance scheme from Old School Essentials: Classic Fantasy
 */
import DslDataModelCharacterEncumbrance, {
  CharacterEncumbrance,
} from "./data-model-character-encumbrance";

// import { DSL } from '../../config';

/**
 * @todo Add template path for encumbrance bar
 * @todo Add template path for inventory item row
 */
export default class DslDataModelCharacterEncumbranceDetailed
  extends DslDataModelCharacterEncumbrance
  implements CharacterEncumbrance
{
  static templateEncumbranceBar = "";

  static templateInventoryRow = "";

  /**
   * The machine-readable label for this encumbrance scheme
   */
  static type = "detailed";

  /**
   * The human-readable label for this encumbrance scheme
   */
  static localizedLabel = "DSL.Setting.EncumbranceDetailed";

  /**
   * The weight (in coins) to add to the total weight value if the character has adventuring gear
   */
  static gearWeight = 80;

  #weight = 0;

  #hasAdventuringGear;

  constructor(
    max = DslDataModelCharacterEncumbrance.baseEncumbranceCap,
    items: Item[] = []
  ) {
    super(DslDataModelCharacterEncumbranceDetailed.type, max);
    this.#hasAdventuringGear = items.some(
      (i: Item) => i.type === "item" && !i.system.treasure
    );
    this.#weight =
      items.reduce(
        (acc, { type, system: { treasure, quantity, weight } }: Item) => {
          if (type === "spell" || type === "ability") return acc;

          let value = acc;

          if (type === "item" && treasure) value += quantity.value * weight;
          if (["weapon", "armor", "container"].includes(type)) value += weight;

          return value;
        },
        0
      ) +
      (this.#hasAdventuringGear
        ? DslDataModelCharacterEncumbranceDetailed.gearWeight
        : 0);
  }

  // eslint-disable-next-line class-methods-use-this
  get steps() {
    return Object.values(DslDataModelCharacterEncumbrance.encumbranceSteps);
  }

  get value(): number {
    return this.#weight;
  }
}
