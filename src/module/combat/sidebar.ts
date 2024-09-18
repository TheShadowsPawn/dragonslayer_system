import DSL from "../config";
import { DSLGroupCombat } from "./combat-group";
import DSLCombatGroupSelector from "./combat-set-groups";
import { DSLCombatant } from "./combatant";

/**
 * @todo Active states for casting and retreating
 * @todo Displaying groups
 */
export class DSLCombatTab extends CombatTracker {
  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: `${DSL.systemPath()}/templates/sidebar/combat-tracker.hbs`,
    });
  }

  static GROUP_CONFIG_APP = new DSLCombatGroupSelector();

  async getData(options) {
    const context = await super.getData(options);
    const isGroupInitiative = game.settings.get(game.system.id, "initiative") === "group";

    // @ts-expect-error - We don't have type data for the combat tracker turn object
    const turns = context.turns.map((turn) => {
      const combatant = game.combat.combatants.get(turn.id);
      turn.isSlowed = turn.initiative === `${DSLCombatant.INITIATIVE_VALUE_SLOWED}`
      turn.isCasting = !!combatant.getFlag(game.system.id, "prepareSpell");
      turn.isRetreating = !!combatant.getFlag(game.system.id, "moveInCombat");
      turn.isOwnedByUser = !!combatant.actor.isOwner;
      turn.group = combatant.group;
      return turn;
    });

    const groups = turns.reduce((arr, turn) => {
      const idx = arr.findIndex(r => r.group === turn.group);

      if (idx !== -1) {
        arr[idx].turns.push(turn);
        return arr;
      }

      return [...arr, {
        group: turn.group,
        label: DSLGroupCombat.GROUPS[turn.group],
        initiative: turn.initiative,
        turns: [turn]
      }];
    }, []);
    
    return foundry.utils.mergeObject(context, {
      turns,
      groups,
      isGroupInitiative
    })
  }

  async #toggleFlag(combatant: DSLCombatant, flag: string) {
    const isActive = !!combatant.getFlag(game.system.id, flag);
    await combatant.setFlag(game.system.id, flag, !isActive);
  }

  activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html);
    const trackerHeader = html.find("#combat > header");

    // Reroll group initiative
    html.find('.combat-button[data-control="reroll"]').click((ev) => {      
      game.combat.rollInitiative();
    });

    html.find('.combat-button[data-control="set-groups"]').click((ev) => {
      DSLCombatTab.GROUP_CONFIG_APP.render(true, { focus: true });
    });
  }

  /**
   * Handle a Combatant control toggle
   * @private
   * @param {Event} event   The originating mousedown event
   */
  async _onCombatantControl(event: any) {
    event.preventDefault();
    event.stopPropagation();
    const btn = event.currentTarget;
    const li = btn.closest(".combatant");
    const combat = this.viewed;
    const c = combat.combatants.get(li.dataset.combatantId);

    switch ( btn.dataset.control ) {
      // Toggle combatant spellcasting flag
      case "casting":
        return this.#toggleFlag(c as DSLCombatant, "prepareSpell");
      // Toggle combatant retreating flag
      case "retreat":
        return this.#toggleFlag(c as DSLCombatant, "moveInCombat");
      // Fall back to the superclass's button events
      default:
        return super._onCombatantControl(event);
    }
  }
  
  _getEntryContextOptions() {
    const options = super._getEntryContextOptions();
    return [
      {
        name: game.i18n.localize("DSL.combat.SetCombatantAsActive"),
        icon: '<i class="fas fa-star-of-life"></i>',
        callback: (li) => {
          const combatantId = li.data('combatant-id')
          const turnToActivate = this.viewed.turns.findIndex(t => t.id === combatantId);
          this.viewed.activateCombatant(turnToActivate);
        }
      },
      ...options
    ];
  }
}
