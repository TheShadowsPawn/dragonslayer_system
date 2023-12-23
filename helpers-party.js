/**
 * @file Helper functions for managing the Party Sheet
 */
import DslPartySheet from "./party/party-sheet";

export const addControl = (object, html) => {
  const control = `<button class='dsl-party-sheet' type="button" title='${game.i18n.localize(
    "DSL.dialog.partysheet"
  )}'><i class='fas fa-users'></i></button>`;
  html.find(".fas.fa-search").replaceWith($(control));
  html.find(".dsl-party-sheet").click((ev) => {
    ev.preventDefault();
    Hooks.call("DSL.Party.showSheet");
  });
};

export const update = (actor) => {
  const partyFlag = actor.getFlag(game.system.id, "party");

  if (partyFlag === null) {
    return;
  }

  DslPartySheet.partySheet.render();
};
