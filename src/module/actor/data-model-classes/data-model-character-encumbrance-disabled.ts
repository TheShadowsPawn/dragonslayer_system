/**
 * @file A class representing the "Disabled" encumbrance scheme;
 *       we aren't tracking carry weight here.
 */
import DslDataModelCharacterEncumbrance, {
  CharacterEncumbrance,
} from "./data-model-character-encumbrance";

// import { DSL } from '../../config';

/**
 * @todo Add template path for encumbrance bar
 * @todo Add template path for inventory item row
 */
export default class DslDataModelCharacterEncumbranceDisabled
  extends DslDataModelCharacterEncumbrance
  implements CharacterEncumbrance
{
  static templateEncumbranceBar = "";

  static templateInventoryRow = "";

  /**
   * The machine-readable label for this encumbrance scheme
   */
  static type = "disabled";

  /**
   * The human-readable label for this encumbrance scheme
   */
  static localizedLabel = "DSL.Setting.EncumbranceDisabled";

  constructor() {
    super(DslDataModelCharacterEncumbranceDisabled.type);
  }

  // eslint-disable-next-line class-methods-use-this
  get value(): number {
    return 0;
  }
}
