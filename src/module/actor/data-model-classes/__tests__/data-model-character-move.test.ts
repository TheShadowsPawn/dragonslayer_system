/**
 * @file Tests for the data model class that determines character movement speed
 */
import { QuenchMethods } from "../../../../e2e";
import DslDataModelCharacterEncumbrance from "../data-model-character-encumbrance";
import EncumbranceBasic from "../data-model-character-encumbrance-basic";
import EncumbranceComplete from "../data-model-character-encumbrance-complete";
import EncumbranceDetailed from "../data-model-character-encumbrance-detailed";
import DslDataModelCharacterMove from "../data-model-character-move";

export const key = "dsl.actor.datamodel.character.move";
export const options = {
  displayName: "DSL: Actor: Data Model: Character Movement",
};

const createMockItem = (
  type: string,
  weight: number,
  quantity: number,
  itemOptions = {}
): Item =>
  // eslint-disable-next-line new-cap
  new Item.implementation({
    name: `Mock ${type} ${foundry.utils.randomID()}`,
    type,
    system: { ...itemOptions, weight, quantity: { value: quantity } },
  }) as Item;

export default ({ describe, it, expect }: QuenchMethods) => {
  describe("Prevent autocalculation when...", () => {
    it("Autocalculation is off", () => {
      const enc = new EncumbranceBasic();
      const move = new DslDataModelCharacterMove(enc, false);
      expect(move.base).to.equal(DslDataModelCharacterMove.baseMoveRate);
    });
    it("Encumbrance is disabled", () => {
      const enc = new DslDataModelCharacterEncumbrance("disabled");
      const move = new DslDataModelCharacterMove(enc);
      expect(move.base).to.equal(DslDataModelCharacterMove.baseMoveRate);
    });
    it("Encumbrance is not provided", () => {
      const move = new DslDataModelCharacterMove();
      expect(move.base).to.equal(DslDataModelCharacterMove.baseMoveRate);
    });
  });

  describe("Correctly calculates from Basic Encumbrance", () => {
    it("While unarmored", () => {
      let enc = new EncumbranceBasic();
      let move = new DslDataModelCharacterMove(enc);
      expect(move.base).to.equal(DslDataModelCharacterMove.baseMoveRate);

      enc = new EncumbranceBasic(undefined, [
        createMockItem("armor", 100, 1, { type: "unarmored", equipped: true }),
        createMockItem("armor", 100, 1, { type: "light", equipped: false }),
        createMockItem("armor", 100, 1, { type: "heavy", equipped: false }),
      ]);
      move = new DslDataModelCharacterMove(enc);
      expect(move.base).to.equal(DslDataModelCharacterMove.baseMoveRate);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(move.encounter).to.equal(
        DslDataModelCharacterMove.baseMoveRate / 3
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(move.overland).to.equal(
        DslDataModelCharacterMove.baseMoveRate / 5
      );
    });
    it("While lightly armored", () => {
      const enc = new EncumbranceBasic(undefined, [
        createMockItem("armor", 100, 1, { type: "unarmored", equipped: false }),
        createMockItem("armor", 100, 1, { type: "light", equipped: true }),
        createMockItem("armor", 100, 1, { type: "heavy", equipped: false }),
      ]);
      const move = new DslDataModelCharacterMove(enc);
      expect(move.base).to.equal(DslDataModelCharacterMove.baseMoveRate * 0.75);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(move.encounter).to.equal(
        (DslDataModelCharacterMove.baseMoveRate * 0.75) / 3
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(move.overland).to.equal(
        (DslDataModelCharacterMove.baseMoveRate * 0.75) / 5
      );
    });
    it("While heavily armored", () => {
      const enc = new EncumbranceBasic(undefined, [
        createMockItem("armor", 100, 1, { type: "unarmored", equipped: false }),
        createMockItem("armor", 100, 1, { type: "light", equipped: false }),
        createMockItem("armor", 100, 1, { type: "heavy", equipped: true }),
      ]);
      const move = new DslDataModelCharacterMove(enc);
      expect(move.base).to.equal(DslDataModelCharacterMove.baseMoveRate * 0.5);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(move.encounter).to.equal(
        (DslDataModelCharacterMove.baseMoveRate * 0.5) / 3
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(move.overland).to.equal(
        (DslDataModelCharacterMove.baseMoveRate * 0.5) / 5
      );
    });
    it("While carrying a significant amount of treasure", () => {
      let enc = new EncumbranceBasic(undefined, [
        createMockItem("item", EncumbranceBasic.significantTreasure - 1, 1, {
          treasure: true,
        }),
      ]);
      let move = new DslDataModelCharacterMove(enc);
      expect(move.base).to.equal(DslDataModelCharacterMove.baseMoveRate);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(move.encounter).to.equal(
        DslDataModelCharacterMove.baseMoveRate / 3
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(move.overland).to.equal(
        DslDataModelCharacterMove.baseMoveRate / 5
      );

      enc = new EncumbranceBasic(undefined, [
        createMockItem("item", EncumbranceBasic.significantTreasure, 1, {
          treasure: true,
        }),
      ]);
      move = new DslDataModelCharacterMove(enc);
      expect(move.base).to.equal(DslDataModelCharacterMove.baseMoveRate - 30);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(move.encounter).to.equal(
        (DslDataModelCharacterMove.baseMoveRate - 30) / 3
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(move.overland).to.equal(
        (DslDataModelCharacterMove.baseMoveRate - 30) / 5
      );
    });
  });
  describe("Correctly calculates from Detailed Encumbrance", () => {
    it("At unencumbered", () => {
      const expectedBase = DslDataModelCharacterMove.baseMoveRate;
      const expectedEncounter = expectedBase / 3;
      const expectedOverland = expectedBase / 5;

      let enc = new EncumbranceDetailed();
      let move = new DslDataModelCharacterMove(enc);

      expect(move.base).to.equal(expectedBase);
      expect(move.encounter).to.equal(expectedEncounter);
      expect(move.overland).to.equal(expectedOverland);

      enc = new EncumbranceDetailed(undefined, [
        createMockItem("item", 800, 1),
      ]);
      move = new DslDataModelCharacterMove(enc);

      expect(move.base).to.equal(expectedBase);
      expect(move.encounter).to.equal(expectedEncounter);
      expect(move.overland).to.equal(expectedOverland);
    })
    it('At 12.5% encumbered (100% moverate)', () => {
      const expectedBase = DslDataModelCharacterMove.baseMoveRate;
      const expectedEncounter = expectedBase / 3;
      const expectedOverland = expectedBase / 5;

      const enc = new EncumbranceDetailed(undefined, [
        createMockItem(
          "item",
          DslDataModelCharacterEncumbrance.baseEncumbranceCap * 0.125,
          1,
          { treasure: true }
        ),
      ]);
      const move = new DslDataModelCharacterMove(enc);

      expect(move.base).to.equal(expectedBase);
      expect(move.encounter).to.equal(expectedEncounter)
      expect(move.overland).to.equal(expectedOverland)
    })
    it('At 25% encumbered (100% moverate)', () => {
      const expectedBase = DslDataModelCharacterMove.baseMoveRate;
      const expectedEncounter = expectedBase / 3;
      const expectedOverland = expectedBase / 5;

      const enc = new EncumbranceDetailed(undefined, [
        createMockItem(
          "item",
          DslDataModelCharacterEncumbrance.baseEncumbranceCap * 0.25,
          1,
          { treasure: true }
        ),
      ]);
      const move = new DslDataModelCharacterMove(enc);

      expect(move.base).to.equal(expectedBase);
      expect(move.encounter).to.equal(expectedEncounter)
      expect(move.overland).to.equal(expectedOverland)
    })
    it('At 25.1% encumbered (75% moverate)', () => {
      const expectedBase = DslDataModelCharacterMove.baseMoveRate * .75;
      const expectedEncounter = expectedBase / 3;
      const expectedOverland = expectedBase / 5;
      
      let enc = new EncumbranceDetailed(undefined, [
        createMockItem('item', DslDataModelCharacterEncumbrance.baseEncumbranceCap * .251, 1, {treasure: true}),
      ]);
      let move = new DslDataModelCharacterMove(enc);

      expect(move.base).to.equal(expectedBase);
      expect(move.encounter).to.equal(expectedEncounter)
      expect(move.overland).to.equal(expectedOverland)
    })
    it('At 37.5% encumbered (75% moverate)', () => {
      const expectedBase = DslDataModelCharacterMove.baseMoveRate * .75;
      const expectedEncounter = expectedBase / 3;
      const expectedOverland = expectedBase / 5;
      
      let enc = new EncumbranceDetailed(undefined, [
        createMockItem('item', DslDataModelCharacterEncumbrance.baseEncumbranceCap * .375, 1, {treasure: true}),
      ]);
      let move = new DslDataModelCharacterMove(enc);

      expect(move.base).to.equal(expectedBase);
      expect(move.encounter).to.equal(expectedEncounter)
      expect(move.overland).to.equal(expectedOverland)
    })
    it('At 37.51% encumbered (50% moverate)', () => {
      const expectedBase = DslDataModelCharacterMove.baseMoveRate * .50;
      const expectedEncounter = expectedBase / 3;
      const expectedOverland = expectedBase / 5;
      
      let enc = new EncumbranceDetailed(undefined, [
        createMockItem('item', DslDataModelCharacterEncumbrance.baseEncumbranceCap * .3751, 1, {treasure: true}),
      ]);
      let move = new DslDataModelCharacterMove(enc);

      expect(move.base).to.equal(expectedBase);
      expect(move.encounter).to.equal(expectedEncounter)
      expect(move.overland).to.equal(expectedOverland)
    })
    it('At 50% encumbered (50% moverate)', () => {
      const expectedBase = DslDataModelCharacterMove.baseMoveRate * .50;
      const expectedEncounter = expectedBase / 3;
      const expectedOverland = expectedBase / 5;
      
      let enc = new EncumbranceDetailed(undefined, [
        createMockItem('item', DslDataModelCharacterEncumbrance.baseEncumbranceCap * .5, 1, {treasure: true}),
      ]);
      let move = new DslDataModelCharacterMove(enc);

      expect(move.base).to.equal(expectedBase);
      expect(move.encounter).to.equal(expectedEncounter)
      expect(move.overland).to.equal(expectedOverland)
    })
    it('At 50.1% encumbered (25% moverate)', () => {
      const expectedBase = DslDataModelCharacterMove.baseMoveRate * .25;
      const expectedEncounter = expectedBase / 3;
      const expectedOverland = expectedBase / 5;
      
      let enc = new EncumbranceDetailed(undefined, [
        createMockItem('item', DslDataModelCharacterEncumbrance.baseEncumbranceCap * .501, 1, {treasure: true}),
      ]);
      let move = new DslDataModelCharacterMove(enc);

      expect(move.base).to.equal(expectedBase);
      expect(move.encounter).to.equal(expectedEncounter)
      expect(move.overland).to.equal(expectedOverland)
    })
    it('At 100% encumbered (25% moverate)', () => {
      const expectedBase = DslDataModelCharacterMove.baseMoveRate * .25;
      const expectedEncounter = expectedBase / 3;
      const expectedOverland = expectedBase / 5;
      
      let enc = new EncumbranceDetailed(undefined, [
        createMockItem('item', DslDataModelCharacterEncumbrance.baseEncumbranceCap, 1, {treasure: true}),
      ]);
      const move = new DslDataModelCharacterMove(enc);

      expect(move.base).to.equal(expectedBase);
      expect(move.encounter).to.equal(expectedEncounter)
      expect(move.overland).to.equal(expectedOverland)
    })
    it('At 100.1% encumbered (0% moverate)', () => {
      const expectedBase = 0;
      const expectedEncounter = 0;
      const expectedOverland = 0;
      
      let enc = new EncumbranceDetailed(undefined, [
        createMockItem('item', DslDataModelCharacterEncumbrance.baseEncumbranceCap, 1.001, {treasure: true}),
      ]);
      let move = new DslDataModelCharacterMove(enc);

      expect(move.base).to.equal(expectedBase);
      expect(move.encounter).to.equal(expectedEncounter)
      expect(move.overland).to.equal(expectedOverland)
    })
  })
  describe('Correctly calculates from Complete Encumbrance', () => {
    it('At 0% encumbered (100% moverate)', () => {
      const expectedBase = DslDataModelCharacterMove.baseMoveRate;
      const expectedEncounter = expectedBase / 3;
      const expectedOverland = expectedBase / 5;

      const enc = new EncumbranceComplete();
      const move = new DslDataModelCharacterMove(enc);

      expect(move.base).to.equal(expectedBase);
      expect(move.encounter).to.equal(expectedEncounter);
      expect(move.overland).to.equal(expectedOverland);
    })
    it('At 12.5% encumbered (100% moverate)', () => {
      const expectedBase = DslDataModelCharacterMove.baseMoveRate;
      const expectedEncounter = expectedBase / 3;
      const expectedOverland = expectedBase / 5;
      
      let enc = new EncumbranceComplete(undefined, [
        createMockItem('item', DslDataModelCharacterEncumbrance.baseEncumbranceCap * .125, 1 ),
      ]);
      let move = new DslDataModelCharacterMove(enc);

      expect(move.base).to.equal(expectedBase);
      expect(move.encounter).to.equal(expectedEncounter)
      expect(move.overland).to.equal(expectedOverland)
    })
    it('At 25% encumbered (100% moverate)', () => {
      const expectedBase = DslDataModelCharacterMove.baseMoveRate;
      const expectedEncounter = expectedBase / 3;
      const expectedOverland = expectedBase / 5;
      
      let enc = new EncumbranceComplete(undefined, [
        createMockItem('item', DslDataModelCharacterEncumbrance.baseEncumbranceCap * .25, 1 ),
      ]);
      let move = new DslDataModelCharacterMove(enc);

      expect(move.base).to.equal(expectedBase);
      expect(move.encounter).to.equal(expectedEncounter)
      expect(move.overland).to.equal(expectedOverland)
    })
    it('At 25.1% encumbered (75% moverate)', () => {
      const expectedBase = DslDataModelCharacterMove.baseMoveRate * .75;
      const expectedEncounter = expectedBase / 3;
      const expectedOverland = expectedBase / 5;
      
      let enc = new EncumbranceComplete(undefined, [
        createMockItem('item', DslDataModelCharacterEncumbrance.baseEncumbranceCap * .251, 1 ),
      ]);
      const move = new DslDataModelCharacterMove(enc);

      expect(move.base).to.equal(expectedBase);
      expect(move.encounter).to.equal(expectedEncounter)
      expect(move.overland).to.equal(expectedOverland)
    })
    it('At 37.5% encumbered (75% moverate)', () => {
      const expectedBase = DslDataModelCharacterMove.baseMoveRate * .75;
      const expectedEncounter = expectedBase / 3;
      const expectedOverland = expectedBase / 5;
      
      let enc = new EncumbranceComplete(undefined, [
        createMockItem('item', DslDataModelCharacterEncumbrance.baseEncumbranceCap * .375, 1 ),
      ]);
      const move = new DslDataModelCharacterMove(enc);

      expect(move.base).to.equal(expectedBase);
      expect(move.encounter).to.equal(expectedEncounter)
      expect(move.overland).to.equal(expectedOverland)
    })
    it('At 37.51% encumbered (50% moverate)', () => {
      const expectedBase = DslDataModelCharacterMove.baseMoveRate * .50;
      const expectedEncounter = expectedBase / 3;
      const expectedOverland = expectedBase / 5;
      
      let enc = new EncumbranceComplete(undefined, [
        createMockItem('item', DslDataModelCharacterEncumbrance.baseEncumbranceCap * .3751, 1 ),
      ]);
      let move = new DslDataModelCharacterMove(enc);

      expect(move.base).to.equal(expectedBase);
      expect(move.encounter).to.equal(expectedEncounter)
      expect(move.overland).to.equal(expectedOverland)
    })
    it('At 50% encumbered (50% moverate)', () => {
      const expectedBase = DslDataModelCharacterMove.baseMoveRate * .50;
      const expectedEncounter = expectedBase / 3;
      const expectedOverland = expectedBase / 5;
      
      let enc = new EncumbranceComplete(undefined, [
        createMockItem('item', DslDataModelCharacterEncumbrance.baseEncumbranceCap * .5, 1 ),
      ]);
      let move = new DslDataModelCharacterMove(enc);

      expect(move.base).to.equal(expectedBase);
      expect(move.encounter).to.equal(expectedEncounter)
      expect(move.overland).to.equal(expectedOverland)
    })
    it('At 50.1% encumbered (25% moverate)', () => {
      const expectedBase = DslDataModelCharacterMove.baseMoveRate * .25;
      const expectedEncounter = expectedBase / 3;
      const expectedOverland = expectedBase / 5;
      
      let enc = new EncumbranceComplete(undefined, [
        createMockItem('item', DslDataModelCharacterEncumbrance.baseEncumbranceCap * .501, 1 ),
      ]);
      let move = new DslDataModelCharacterMove(enc);

      expect(move.base).to.equal(expectedBase);
      expect(move.encounter).to.equal(expectedEncounter)
      expect(move.overland).to.equal(expectedOverland)
    })
    it('At 100% encumbered (25% moverate)', () => {
      const expectedBase = DslDataModelCharacterMove.baseMoveRate * .25;
      const expectedEncounter = expectedBase / 3;
      const expectedOverland = expectedBase / 5;
      
      let enc = new EncumbranceComplete(undefined, [
        createMockItem('item', DslDataModelCharacterEncumbrance.baseEncumbranceCap, 1 ),
      ]);
      let move = new DslDataModelCharacterMove(enc);

      expect(move.base).to.equal(expectedBase);
      expect(move.encounter).to.equal(expectedEncounter)
      expect(move.overland).to.equal(expectedOverland)
    })
    it('At 100.1% encumbered (0% moverate)', () => {
      const expectedBase = 0;
      const expectedEncounter = 0;
      const expectedOverland = 0;
      
      let enc = new EncumbranceComplete(undefined, [
        createMockItem('item', DslDataModelCharacterEncumbrance.baseEncumbranceCap, 1.001 ),
      ]);
      const move = new DslDataModelCharacterMove(enc);

      expect(move.base).to.equal(expectedBase);
      expect(move.encounter).to.equal(expectedEncounter);
      expect(move.overland).to.equal(expectedOverland);
    });
  });
};
