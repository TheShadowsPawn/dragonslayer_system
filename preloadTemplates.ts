/**
 * @file A file that manages preloading our system templates
 */
import DSL from "./config";

const preloadHandlebarsTemplates = async () => {
  const templatePaths = [
    // Character Sheets
    `${DSL.systemPath()}/templates/actors/character-sheet.html`,
    `${DSL.systemPath()}/templates/actors/monster-sheet.html`,
    // Character Sheets Partials
    `${DSL.systemPath()}/templates/actors/partials/character-header.html`,
    `${DSL.systemPath()}/templates/actors/partials/character-attributes-tab.html`,
    `${DSL.systemPath()}/templates/actors/partials/character-abilities-tab.html`,
    `${DSL.systemPath()}/templates/actors/partials/character-spells-tab.html`,
    `${DSL.systemPath()}/templates/actors/partials/character-inventory-tab.html`,
    `${DSL.systemPath()}/templates/actors/partials/actor-item-summary.html`,
    `${DSL.systemPath()}/templates/actors/partials/character-notes-tab.html`,
    `${DSL.systemPath()}/templates/actors/partials/monster-header.html`,
    `${DSL.systemPath()}/templates/actors/partials/monster-attributes-tab.html`,
    // Item Display
    `${DSL.systemPath()}/templates/actors/partials/item-auto-tags-partial.html`,
    // Party Sheet
    `${DSL.systemPath()}/templates/apps/party-sheet.html`,
    // `${DSL.systemPath()}/templates/apps/party-xp.html`,
  ];
  return loadTemplates(templatePaths);
};

export default preloadHandlebarsTemplates;
