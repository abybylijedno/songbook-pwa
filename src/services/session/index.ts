import { useSessionStore } from './store';

import { isUidSet } from './cookie';
import { ConnectionCommander } from './ConnectionCommander';

export const cc = new ConnectionCommander();

/**
 * Check if the session is stored in the cookies
 * and if it is, restore it (attempt to reconnect)
 * @returns 
 */
export const restoreSession = () => {
  if (!isUidSet()) {
    return;
  }
}

export {
  useSessionStore
};
