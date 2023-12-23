/**
 * @file The entry point for the DSL system
 *       We should handle most of our setup here.
 */
import DslActorSheetCharacter from "./module/actor/character-sheet";
import DslDataModelCharacter from "./module/actor/data-model-character";
import DslDataModelMonster from "./module/actor/data-model-monster";
import DslActor from "./module/actor/entity";
import DslActorSheetMonster from "./module/actor/monster-sheet";

import DslDataModelAbility from "./module/item/data-model-ability";
import DslDataModelArmor from "./module/item/data-model-armor";
import DslDataModelContainer from "./module/item/data-model-container";
import DslDataModelItem from "./module/item/data-model-item";
import DslDataModelSpell from "./module/item/data-model-spell";
import DslDataModelWeapon from "./module/item/data-model-weapon";
import DslItem from "./module/item/entity";
import DslItemSheet from "./module/item/item-sheet";

import * as chat from "./module/helpers-chat";
import DslCombat from "./module/combat";
import DSL from "./module/config";
import registerFVTTModuleAPIs from "./module/fvttModuleAPIs";
import handlebarsHelpers from "./module/helpers-handlebars";
import * as macros from "./module/helpers-macros";
import * as party from "./module/helpers-party";
import DslPartySheet from "./module/party/party-sheet";
import templates from "./module/preloadTemplates";
import * as renderList from "./module/renderList";
import registerSettings from "./module/settings";
import * as treasure from "./module/helpers-treasure";

import "./e2e";

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Hooks.once("init", async () => {
  /**
   * Set an initiative formula for the system
   *
   * @type {string}
   */
  CONFIG.Combat.initiative = {
    formula: "1d6 + @init",
    decimals: 2,
  };

  CONFIG.DSL = DSL;

  game.dsl = {
    rollItemMacro: macros.rollItemMacro,
    rollTableMacro: macros.rollTableMacro,
    dslCombat: DslCombat,
  };

  // Init Party Sheet handler
  DslPartySheet.init();

  // Custom Handlebars helpers
  handlebarsHelpers();

  // Give modules a chance to add encumbrance schemes
  // They can do so by adding their encumbrance schemes
  // to CONFIG.DSL.encumbranceOptions
  Hooks.call("dsl-setup-encumbrance");

  // Register custom system settings
  registerSettings();

  // Register APIs of Foundry VTT Modules we explicitly support that provide custom hooks
  registerFVTTModuleAPIs();

  CONFIG.Actor.documentClass = DslActor;
  CONFIG.Item.documentClass = DslItem;

  CONFIG.Actor.systemDataModels = {
    character: DslDataModelCharacter,
    monster: DslDataModelMonster,
  };
  CONFIG.Item.systemDataModels = {
    weapon: DslDataModelWeapon,
    armor: DslDataModelArmor,
    item: DslDataModelItem,
    spell: DslDataModelSpell,
    ability: DslDataModelAbility,
    container: DslDataModelContainer,
  };

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet(game.system.id, DslActorSheetCharacter, {
    types: ["character"],
    makeDefault: true,
    label: "DSL.SheetClassCharacter",
  });
  Actors.registerSheet(game.system.id, DslActorSheetMonster, {
    types: ["monster"],
    makeDefault: true,
    label: "DSL.SheetClassMonster",
  });

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet(game.system.id, DslItemSheet, {
    makeDefault: true,
    label: "DSL.SheetClassItem",
  });

  await templates();
});

/**
 * This function runs after game data has been requested and loaded from the servers, so entities exist
 */
Hooks.once("setup", () => {
  // Localize CONFIG objects once up-front
  ["saves_short", "saves_long", "scores", "armor", "colors", "tags"].forEach(
    (o) => {
      CONFIG.DSL[o] = Object.entries(CONFIG.DSL[o]).reduce((obj, e) => {
        const localized = { ...obj };
        localized[e[0]] = game.i18n.localize(e[1]);
        return localized;
      }, {});
    }
  );

  // Custom languages
  const languages = game.settings.get(game.system.id, "languages");
  if (languages !== "") {
    const langArray = languages.split(",").map((s) => s.trim());
    CONFIG.DSL.languages = langArray;
  }
});

Hooks.once("ready", async () => {
  Hooks.on("hotbarDrop", (bar, data, slot) => {
    macros.createDslMacro(data, slot);
    // Returning false to stop the rest of hotbarDrop handling.
    return false;
  });
});

// License info
Hooks.on("renderSidebarTab", async (object, html) => {
  if (object instanceof ActorDirectory) {
    party.addControl(object, html);
  }
  if (object instanceof Settings) {
    const gamesystem = html.find("#game-details");
    // SRD Link
    const dsl = gamesystem.find("h4").last();
    dsl.append(
      ` <sub><a href="https://oldschoolessentials.necroticgnome.com/srd/index.php">SRD<a></sub>`
    );

    // License text
    const template = `${DSL.systemPath()}/templates/chat/license.html`;
    const rendered = await renderTemplate(template);
    gamesystem.find(".system").append(rendered);

    // User guide
    const docs = html.find("button[data-action='docs']");
    const styling =
      "border:none;margin-right:2px;vertical-align:middle;margin-bottom:5px";
    $(
      `<button type="button" data-action="userguide"><img src='${DSL.assetsPath}/dragon.png' width='16' height='16' style='${styling}'/>Old School Guide</button>`
    ).insertAfter(docs);
    html.find('button[data-action="userguide"]').click(() => {
      new FrameViewer("https://vttred.github.io/dsl", {
        resizable: true,
      }).render(true);
    });
  }
});

Hooks.on("preCreateCombatant", (combat, data, options, id) => {
  const init = game.settings.get(game.system.id, "initiative");
  if (init === "group") {
    DslCombat.addCombatant(combat, data, options, id);
  }
});

Hooks.on("updateCombatant", DslCombat.debounce(DslCombat.updateCombatant), 100);
Hooks.on("renderCombatTracker", DslCombat.debounce(DslCombat.format, 100));
Hooks.on("preUpdateCombat", DslCombat.preUpdateCombat);
Hooks.on(
  "getCombatTrackerEntryContext",
  DslCombat.debounce(DslCombat.addContextEntry, 100)
);

Hooks.on("renderChatLog", (app, html) => DslItem.chatListeners(html));
Hooks.on("getChatLogEntryContext", chat.addChatMessageContextOptions);
Hooks.on("renderChatMessage", chat.addChatMessageButtons);
Hooks.on("renderRollTableConfig", treasure.augmentTable);
Hooks.on("updateActor", party.update);

Hooks.on("renderCompendium", renderList.RenderCompendium);
Hooks.on("renderSidebarDirectory", renderList.RenderDirectory);

Hooks.on("DSL.Party.showSheet", DslPartySheet.showPartySheet);
