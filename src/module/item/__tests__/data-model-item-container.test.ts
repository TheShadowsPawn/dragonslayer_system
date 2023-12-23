/**
 * @file Contains tests for Container Item Data Model.
 */
// eslint-disable-next-line prettier/prettier, import/no-cycle
import { QuenchMethods } from "../../../e2e";
import DslDataModelContainer from "../data-model-container";

export const key = "dsl.item.datamodel.container";
export const options = { displayName: "DSL: Item: Data Model: Container" };

export default ({ describe, it, expect }: QuenchMethods) => {
  describe("contents()", () => {
    it("Returns null if itemIds is empty Array", () => {
      const container = new DslDataModelContainer();
      expect(container.contents).is.null;
    });
  });

  describe("totalWeight()", () => {
    it("Returns 0 with no items", () => {
      const container = new DslDataModelContainer();
      expect(container.totalWeight).equal(0);
    });
  });

  describe("manualTags()", () => {
    const container = new DslDataModelContainer();
    it("By default return empty array", () => {
      expect(container.manualTags.length).equal(0);
    });

    it("Can write tags to tags field", () => {
      container.tags = [{ value: "value", title: "title" }];
      expect(container.tags.length).equal(1);
      expect(Object.keys(container.tags[0]).length).equal(2);
      expect(container.tags[0].title).equal("title");
      expect(container.tags[0].value).equal("value");
      expect(container.tags[0].label).is.undefined;
    });

    it("Can retrieve tags", () => {
      expect(container.manualTags.length).equal(1);
      expect(container.manualTags[0].title).equal("title");
      expect(container.manualTags[0].value).equal("value");
      expect(container.tags[0].label).is.undefined;
    });
  });

  describe("autoTags()", () => {
    const container = new DslDataModelContainer();
    it("By default return no auto-tags", () => {
      expect(container.autoTags.length).equal(0);
    });

    it("Can create autoTags", () => {
      container.tags = [{ value: CONFIG.DSL.tags.blunt }];
      expect(container.tags.length).equal(1);
      expect(container.autoTags[0].label).equal(CONFIG.DSL.tags.blunt);
      expect(container.autoTags[0].icon).equal("fa-hammer-crash");
      expect(container.autoTags[0].image).equal(
        `${CONFIG.DSL.assetsPath}/blunt.png`
      );
    });
  });
};
