import { DslCombat } from "./module/combat";
import type { DslConfig } from "./module/config";

declare global {
  interface LenientGlobalVariableTypes {
    // Allowing game to be accessible as a typescript type regardless of whether or not the object has been initialized.
    // See documentation for LenientGlobalVariableTypes in @league-of-foundry-developers/foundry-vtt-types
    game: never;
    canvas: never;
  }

  interface CONFIG {
    DSL: DslConfig;
  }

  interface Game {
    dsl: {
      rollItemMacro: (itemName: string) => Promise<void>;
      dslCombat: DslCombat;
    };
  }
  
  namespace Game {
    interface SystemData<T> {
      /**
       * Defining game.system.id as a const
       */
      id: "dsl";
    }
  }
}
