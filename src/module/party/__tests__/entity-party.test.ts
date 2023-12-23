/**
 * @file Contains tests for Party Entity.
 */
// eslint-disable-next-line prettier/prettier, import/no-cycle
import { QuenchMethods } from "../../../e2e";
import { cleanUpActorsByKey, createMockActorKey } from "../../../e2e/testUtils";
import DslParty from "../party";
import DslPartySheet from "../party-sheet";

export const key = "dsl.party.entity";
export const options = { displayName: "DSL: Party: Entity" };

const createMockActor = async (type: string, data: object = {}) =>
  createMockActorKey(type, data, key);

export default ({ describe, it, expect, assert, after }: QuenchMethods) => {
  describe("currentParty()", () => {
    it("Returns all characters in a party", async () => {
      const actor = await createMockActor("character");
      const partySheet = new DslPartySheet();
      // eslint-disable-next-line no-underscore-dangle
      const promisedAnswer = await partySheet._addActorToParty(actor);
      expect(promisedAnswer).is.undefined;
      assert(actor?.getFlag(game.system.id, "party"));

      const party = DslParty;
      const actorsInParty = game.actors?.filter(
        (o) => o.flags[game.system.id]?.party
      );
      expect(party.currentParty.length).equal(actorsInParty?.length);
      await actor?.delete();
    });
  });

  after(async () => {
    await cleanUpActorsByKey(key);
  });
};
