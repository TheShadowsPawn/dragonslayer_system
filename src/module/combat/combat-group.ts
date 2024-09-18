import DSL from "../config";
import { DSLCombat } from "./combat";
import { DSLGroupCombatant } from "./combatant-group";

export const colorGroups = DSL.colors;
export const actionGroups = {
  'slow': "DSL.items.Slow",
  'cast': "DSL.spells.Cast",
}

/**
 * An extension of Foundry's Combat class that implements side-based initiative.
 *
 * @todo Display the initiative results roll as a chat card
 */
export class DSLGroupCombat extends DSLCombat {
  static FORMULA = "1d6";
  
  static get GROUPS () {
    return {
      ...colorGroups,
      ...actionGroups,
    };
  }

  async #rollAbsolutelyEveryone() {
    await this.rollInitiative();
  }
  
  async rollInitiative() {
    const groupsToRollFor = this.availableGroups;
    const rollPerGroup = groupsToRollFor.reduce((prev, curr) => ({
      ...prev,
      [curr]: new Roll(DSLGroupCombat.FORMULA) 
    }), {});

    const results = await this.#prepareGroupInitiativeDice(rollPerGroup);
    
    const updates = this.combatants.map(
      (c) => ({ _id: c.id, initiative: results[c.group].initiative })
    )

    await this.updateEmbeddedDocuments("Combatant", updates);
    await this.#rollInitiativeUIFeedback(results);
    await this.activateCombatant(0);
    return this;
  }

  async #prepareGroupInitiativeDice(rollPerGroup: unknown) {
    const pool = foundry.dice.terms.PoolTerm.fromRolls(Object.values(rollPerGroup));
    const evaluatedRolls = await Roll.fromTerms([pool]).roll()
    const rollValues = evaluatedRolls.dice.map(d => d.total);
    return this.availableGroups.reduce((prev, curr, i) => ({
        ...prev,
        [curr]: {
          initiative: curr !== "slow" ? rollValues[i] : DSLGroupCombatant.INITIATIVE_VALUE_SLOWED,
          roll: evaluatedRolls.dice[i]
        }
      }), {});
  }

  async #rollInitiativeUIFeedback(groups = []) {
    const content = [
      Object.keys(groups).map(
        (k) => k === "slow" ? "" : this.#constructInitiativeOutputForGroup(k, groups[k].roll)
      ).join("\n")
    ];
    const chatData = content.map(c => {
      return {
        speaker: {alias: game.i18n.localize(".Initiative")},
        sound: CONFIG.sounds.dice,
        content: c
      };
    });
    ChatMessage.implementation.createDocuments(chatData);
  }

  #constructInitiativeOutputForGroup(group, roll) {
    return `    
      <p>${game.i18n.format("DSL.roll.initiative", { group })}
      <div class="dice-roll">   
        <div class="dice-result">
          <div class="dice-formula">${roll.formula}</div>
            <div class="dice-tooltip">
                  <section class="tooltip-part">
                    <div class="dice">
                        <header class="part-header flexrow">
                            <span class="part-formula">${roll.formula}</span>
                            <span class="part-total">${roll.total}</span>
                        </header>
                        <ol class="dice-rolls">
                        ${roll.results.map(r => `
                          <li class="roll">${r.result}</li>
                        `).join("\n")}
                        </ol>
                    </div>
                  </section>
            </div>
          <h4 class="dice-total">${roll.total}</h4>
        </div>
      </div>
    `;
  }

  get availableGroups(): string[] {
    return [...new Set(
      this.combatants.map(c => c.group)
    )]
  }

  get combatantsByGroup(): Record<string, unknown> {
    return this.availableGroups.reduce((prev, curr) => ({
      ...prev,
      [curr]: this.combatants.filter(c => c.group === curr)
    }), {});
  }

  get groupInitiativeScores(): unknown {
    const initiativeMap = new Map()
    for (const group in this.combatantsByGroup) {
      initiativeMap.set(group, this.combatantsByGroup[group][0].initiative)
    }

    return initiativeMap;
  }
}
