/**
 * @file Contains tests for Entity Tweaks sheet.
 */
// eslint-disable-next-line prettier/prettier, import/no-cycle
import { QuenchMethods } from "../../../e2e";
import {
  cleanUpActorsByKey,
  createMockActorKey,
  openWindows,
  waitForInput,
} from "../../../e2e/testUtils";
import DslEntityTweaks from "../entity-tweaks";

export const key = "dsl.actor.sheet.dialog.entity-tweaks";
export const options = {
  displayName: "DSL: Actor: Dialog Sheet: Entity Tweaks",
};

const createMockActor = async (type: string, data: object = {}) =>
  createMockActorKey(type, data, key);

export default ({ describe, it, expect, assert, after }: QuenchMethods) => {
  describe("defaultOptions()", () => {
    it("Has correctly set defaultOptions", () => {
      const entityTweaks = new DslEntityTweaks();
      expect(entityTweaks.options.id).equal("sheet-tweaks");
      expect(entityTweaks.options.classes).contain("sheet-tweaks");
      expect(entityTweaks.options.template).contain(
        "/templates/actors/dialogs/tweaks-dialog.html"
      );
      expect(entityTweaks.options.width).equal(380);
    });
  });

  describe("title()", () => {
    it("Creates string in dialog window title", async () => {
      const actor = await createMockActor("character");
      const entityTweaks = new DslEntityTweaks(actor);
      entityTweaks.render(true);
      await waitForInput();
      const dialogTitle = document.querySelector(
        "div.sheet-tweaks .window-title"
      )?.innerHTML;
      expect(typeof dialogTitle).equal("string");
      const dialogs = openWindows("sheet-tweaks");
      expect(dialogs.length).equal(1);
      await dialogs[0].close();
      expect(openWindows("sheet-tweaks").length).equal(0);
    });
  });

  describe("getData()", () => {
    it("Returns proper data", async () => {
      const actor = await createMockActor("character");
      const entityTweaks = new DslEntityTweaks(actor);
      const data = entityTweaks.getData();
      const keys = Object.keys(data);
      assert(keys.length >= 2);
      expect(keys).contain("config");
      expect(keys).contain("user");
      assert(data.isCharacter);
    });
  });

  // @todo: Test with Cypress or mock event
  describe("_updateObject(event, formData)", () => {});

  after(async () => {
    await cleanUpActorsByKey(key);
  });
};
