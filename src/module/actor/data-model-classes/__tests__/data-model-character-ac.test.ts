/**
 * @file Tests for the class representing a creature data model's AC
 */
import { QuenchMethods } from "../../../../e2e";
import DslDataModelCharacterAC from "../data-model-character-ac";

export const key = "dsl.actor.datamodel.character.ac";
export const options = { displayName: "DSL: Actor: Data Model: Character AC" };

export default ({ describe, it, expect }: QuenchMethods) => {
  const armorAC = 4;
  const shieldAC = 2;
  // eslint-disable-next-line new-cap
  const armor = new Item.implementation({
    name: "Armor",
    type: "armor",
    system: {
      ac: { value: armorAC },
      aac: { value: armorAC },
      type: "light",
      equipped: true,
    },
  }) as Item;

  // eslint-disable-next-line new-cap
  const shield = new Item.implementation({
    name: "Shield",
    type: "armor",
    system: {
      ac: { value: shieldAC },
      aac: { value: shieldAC },
      type: "shield",
      equipped: true,
    },
  }) as Item;

  const itemsArmor = [armor];
  const itemsShield = [shield] as Item[];
  const itemsBoth = [armor, shield] as Item[];

  const positiveDexMod = 3;
  const negativeDexMod = -1;

  const positiveArbitraryMod = 2;
  const negativeArbitraryMod = -4;

  describe("Naked AC values", () => {
    describe("Returns the default base AC", () => {
      it("When ascending", () => {
        const ac = new DslDataModelCharacterAC(true);
        expect(ac.value).to.equal(DslDataModelCharacterAC.baseAscending);
      });
      it("When descending", () => {
        const ac = new DslDataModelCharacterAC();
        expect(ac.value).to.equal(DslDataModelCharacterAC.baseDescending);
      });
    });
  });

  describe("Armored AC values", () => {
    describe("Returns the expected AC, provided equipment", () => {
      describe("With armor", () => {
        it("When ascending", () => {
          const ac = new DslDataModelCharacterAC(true, itemsArmor);
          // @todo this should be the expectation, needs to happen after data migration
          // expect(ac,value).to.equal(DslDataModelCharacterAC.baseAscending + armorAC)
          expect(ac.value).to.equal(armorAC);
        });
        it("When descending", () => {
          const ac = new DslDataModelCharacterAC(false, itemsArmor);
          // @todo this should be the expectation, needs to happen after data migration
          // expect(ac,value).to.equal(DslDataModelCharacterAC.baseDescending - armorAC)
          expect(ac.value).to.equal(armorAC);
        });
      });

      describe("With shield", () => {
        it("When ascending", () => {
          const ac = new DslDataModelCharacterAC(true, itemsShield);
          expect(ac.value).to.equal(
            DslDataModelCharacterAC.baseAscending + shieldAC
          );
        });
        it("When descending", () => {
          const ac = new DslDataModelCharacterAC(false, itemsShield);
          expect(ac.value).to.equal(
            DslDataModelCharacterAC.baseDescending - shieldAC
          );
        });
      });

      describe("With armor and shield", () => {
        it("When ascending", () => {
          const ac = new DslDataModelCharacterAC(true, itemsBoth);
          // @todo this should be the expectation, needs to happen after data migration
          // expect(ac,value).to.equal(DslDataModelCharacterAC.baseAscending + armorAC + shieldAC)
          expect(ac.value).to.equal(armorAC + shieldAC);
        });
        it("When descending", () => {
          const ac = new DslDataModelCharacterAC(false, itemsBoth);
          // @todo this should be the expectation, needs to happen after data migration
          // expect(ac,value).to.equal(DslDataModelCharacterAC.baseDescending - armorAC - shieldAC)
          expect(ac.value).to.equal(armorAC - shieldAC);
        });
      });
    });
  });

  describe("With a dexterity modifier", () => {
    describe("Positive modifier", () => {
      describe("When ascending", () => {
        const base = DslDataModelCharacterAC.baseAscending;
        it("Unarmored, no shield", () => {
          const ac = new DslDataModelCharacterAC(true, [], positiveDexMod);
          expect(ac.value).to.equal(base + positiveDexMod);
        });
        it("Armored, no shield", () => {
          const ac = new DslDataModelCharacterAC(
            true,
            itemsArmor,
            positiveDexMod
          );
          expect(ac.value).to.equal(armorAC + positiveDexMod);
        });
        it("Unarmored, shield", () => {
          const ac = new DslDataModelCharacterAC(
            true,
            itemsShield,
            positiveDexMod
          );
          expect(ac.value).to.equal(base + shieldAC + positiveDexMod);
        });
        it("Armored, shield", () => {
          const ac = new DslDataModelCharacterAC(
            true,
            itemsBoth,
            positiveDexMod
          );
          expect(ac.value).to.equal(armorAC + shieldAC + positiveDexMod);
        });
      });
      describe("When descending", () => {
        const base = DslDataModelCharacterAC.baseDescending;
        it("Unarmored, no shield", () => {
          const ac = new DslDataModelCharacterAC(false, [], positiveDexMod);
          expect(ac.value).to.equal(base - positiveDexMod);
        });
        it("Armored, no shield", () => {
          const ac = new DslDataModelCharacterAC(
            false,
            itemsArmor,
            positiveDexMod
          );
          expect(ac.value).to.equal(armorAC - positiveDexMod);
        });
        it("Unarmored, shield", () => {
          const ac = new DslDataModelCharacterAC(
            false,
            itemsShield,
            positiveDexMod
          );
          expect(ac.value).to.equal(base - shieldAC - positiveDexMod);
        });
        it("Armored, shield", () => {
          const ac = new DslDataModelCharacterAC(
            false,
            itemsBoth,
            positiveDexMod
          );
          expect(ac.value).to.equal(armorAC - shieldAC - positiveDexMod);
        });
      });
    });
    describe("Negative modifier", () => {
      describe("When ascending", () => {
        const base = DslDataModelCharacterAC.baseAscending;
        it("Unarmored, no shield", () => {
          const ac = new DslDataModelCharacterAC(true, [], negativeDexMod);
          expect(ac.value).to.equal(base + negativeDexMod);
        });
        it("Armored, no shield", () => {
          const ac = new DslDataModelCharacterAC(
            true,
            itemsArmor,
            negativeDexMod
          );
          expect(ac.value).to.equal(armorAC + negativeDexMod);
        });
        it("Unarmored, shield", () => {
          const ac = new DslDataModelCharacterAC(
            true,
            itemsShield,
            negativeDexMod
          );
          expect(ac.value).to.equal(base + shieldAC + negativeDexMod);
        });
        it("Armored, shield", () => {
          const ac = new DslDataModelCharacterAC(
            true,
            itemsBoth,
            negativeDexMod
          );
          expect(ac.value).to.equal(armorAC + shieldAC + negativeDexMod);
        });
      });
      describe("When descending", () => {
        const base = DslDataModelCharacterAC.baseDescending;
        it("Unarmored, no shield", () => {
          const ac = new DslDataModelCharacterAC(false, [], negativeDexMod);
          expect(ac.value).to.equal(base - negativeDexMod);
        });
        it("Armored, no shield", () => {
          const ac = new DslDataModelCharacterAC(
            false,
            itemsArmor,
            negativeDexMod
          );
          expect(ac.value).to.equal(armorAC - negativeDexMod);
        });
        it("Unarmored, shield", () => {
          const ac = new DslDataModelCharacterAC(
            false,
            itemsShield,
            negativeDexMod
          );
          expect(ac.value).to.equal(base - shieldAC - negativeDexMod);
        });
        it("Armored, shield", () => {
          const ac = new DslDataModelCharacterAC(
            false,
            itemsBoth,
            negativeDexMod
          );
          expect(ac.value).to.equal(armorAC - shieldAC - negativeDexMod);
        });
      });
    });
  });

  describe("With an arbitrary modifier", () => {
    describe("Positive modifier", () => {
      describe("When ascending", () => {
        const base = DslDataModelCharacterAC.baseAscending;
        it("Unarmored, no shield", () => {
          const ac = new DslDataModelCharacterAC(
            true,
            [],
            0,
            positiveArbitraryMod
          );
          expect(ac.value).to.equal(base + positiveArbitraryMod);
        });
        it("Armored, no shield", () => {
          const ac = new DslDataModelCharacterAC(
            true,
            itemsArmor,
            0,
            positiveArbitraryMod
          );
          expect(ac.value).to.equal(armorAC + positiveArbitraryMod);
        });
        it("Unarmored, shield", () => {
          const ac = new DslDataModelCharacterAC(
            true,
            itemsShield,
            0,
            positiveArbitraryMod
          );
          expect(ac.value).to.equal(base + shieldAC + positiveArbitraryMod);
        });
        it("Armored, shield", () => {
          const ac = new DslDataModelCharacterAC(
            true,
            itemsBoth,
            0,
            positiveArbitraryMod
          );
          expect(ac.value).to.equal(armorAC + shieldAC + positiveArbitraryMod);
        });
      });
      describe("When descending", () => {
        const base = DslDataModelCharacterAC.baseDescending;
        it("Unarmored, no shield", () => {
          const ac = new DslDataModelCharacterAC(
            false,
            [],
            0,
            positiveArbitraryMod
          );
          expect(ac.value).to.equal(base - positiveArbitraryMod);
        });
        it("Armored, no shield", () => {
          const ac = new DslDataModelCharacterAC(
            false,
            itemsArmor,
            0,
            positiveArbitraryMod
          );
          expect(ac.value).to.equal(armorAC - positiveArbitraryMod);
        });
        it("Unarmored, shield", () => {
          const ac = new DslDataModelCharacterAC(
            false,
            itemsShield,
            0,
            positiveArbitraryMod
          );
          expect(ac.value).to.equal(base - shieldAC - positiveArbitraryMod);
        });
        it("Armored, shield", () => {
          const ac = new DslDataModelCharacterAC(
            false,
            itemsBoth,
            0,
            positiveArbitraryMod
          );
          expect(ac.value).to.equal(armorAC - shieldAC - positiveArbitraryMod);
        });
      });
    });
    describe("Negative modifier", () => {
      describe("When ascending", () => {
        const base = DslDataModelCharacterAC.baseAscending;
        it("Unarmored, no shield", () => {
          const ac = new DslDataModelCharacterAC(
            true,
            [],
            0,
            negativeArbitraryMod
          );
          expect(ac.value).to.equal(base + negativeArbitraryMod);
        });
        it("Armored, no shield", () => {
          const ac = new DslDataModelCharacterAC(
            true,
            itemsArmor,
            0,
            negativeArbitraryMod
          );
          expect(ac.value).to.equal(armorAC + negativeArbitraryMod);
        });
        it("Unarmored, shield", () => {
          const ac = new DslDataModelCharacterAC(
            true,
            itemsShield,
            0,
            negativeArbitraryMod
          );
          expect(ac.value).to.equal(base + shieldAC + negativeArbitraryMod);
        });
        it("Armored, shield", () => {
          const ac = new DslDataModelCharacterAC(
            true,
            itemsBoth,
            0,
            negativeArbitraryMod
          );
          expect(ac.value).to.equal(armorAC + shieldAC + negativeArbitraryMod);
        });
      });
      describe("When descending", () => {
        const base = DslDataModelCharacterAC.baseDescending;
        it("Unarmored, no shield", () => {
          const ac = new DslDataModelCharacterAC(
            false,
            [],
            0,
            negativeArbitraryMod
          );
          expect(ac.value).to.equal(base - negativeArbitraryMod);
        });
        it("Armored, no shield", () => {
          const ac = new DslDataModelCharacterAC(
            false,
            itemsArmor,
            0,
            negativeArbitraryMod
          );
          expect(ac.value).to.equal(armorAC - negativeArbitraryMod);
        });
        it("Unarmored, shield", () => {
          const ac = new DslDataModelCharacterAC(
            false,
            itemsShield,
            0,
            negativeArbitraryMod
          );
          expect(ac.value).to.equal(base - shieldAC - negativeArbitraryMod);
        });
        it("Armored, shield", () => {
          const ac = new DslDataModelCharacterAC(
            false,
            itemsBoth,
            0,
            negativeArbitraryMod
          );
          expect(ac.value).to.equal(armorAC - shieldAC - negativeArbitraryMod);
        });
      });
    });
  });
};
