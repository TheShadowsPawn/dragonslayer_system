/**
 * @file A class representing the "Complete" encumbrance scheme from Old School Essentials: Classic Fantasy
 */
import DslDataModelCharacterEncumbrance, {
  CharacterEncumbrance,
} from "./data-model-character-encumbrance";

// import { DSL } from '../../config';

/**
 * @todo Add template path for encumbrance bar
 * @todo Add template path for inventory item row
 */
export default class DslDataModelCharacterEncumbranceComplete
  extends DslDataModelCharacterEncumbrance
  implements CharacterEncumbrance
{
  static templateEncumbranceBar = "";

  static templateInventoryRow = "";

  /**
   * The machine-readable label for this encumbrance scheme
   */
  static type = "complete";

  /**
   * The human-readable label for this encumbrance scheme
   */
  static localizedLabel = "DSL.Setting.EncumbranceComplete";

  #weight;

  constructor(
    max = DslDataModelCharacterEncumbrance.baseEncumbranceCap,
    items: Item[] = []
  ) {
    super(DslDataModelCharacterEncumbranceComplete.type, max);
    this.#weight = items.reduce(
      (acc, { type, system: { quantity, weight } }: Item) => {
        if (type === "item") return acc + quantity.value * weight;
        if (["weapon", "armor", "container"].includes(type))
          return acc + weight;
        return acc;
      },
      0
    );
  }

  // eslint-disable-next-line class-methods-use-this
  get steps() {
    return Object.values(DslDataModelCharacterEncumbrance.encumbranceSteps);
  }

  get value(): number {
    return this.#weight;
  }
}
