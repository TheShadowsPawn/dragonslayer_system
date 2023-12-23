/**
 * @file An application used for setting up roll modifiers
 */
import DSL from "../config";

export default class DslCharacterModifiers extends FormApplication {
  static get defaultOptions() {
    const options = super.defaultOptions;
    options.classes = ["dsl", "dialog", "modifiers"];
    options.id = "sheet-modifiers";
    options.template = `${DSL.systemPath()}/templates/actors/dialogs/modifiers-dialog.html`;
    options.width = 240;
    return options;
  }

  /* -------------------------------------------- */

  /**
   * Add the Entity name into the window title
   *
   * @returns {string} - The app title
   */
  get title() {
    return `${this.object.name}: Modifiers`;
  }

  /* -------------------------------------------- */

  /**
   * Construct and return the data object used to render the HTML template for this form application.
   *
   * @returns {object} - The template data
   */
  getData() {
    const data = foundry.utils.deepClone(this.object);
    data.user = game.user;
    return data;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
  }
}
