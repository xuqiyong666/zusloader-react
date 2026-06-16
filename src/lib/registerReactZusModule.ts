import zusloader from 'zusloader';

import type { TReactZusModule } from './types/react-zusmodule';

export function registerReactZusModule(module: TReactZusModule): void {
  zusloader.registerZusModule(module);
}
