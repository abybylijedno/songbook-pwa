import { ref, type Ref, computed, reactive } from 'vue';
import { defineStore } from 'pinia';
import { type ISessionDetails } from '@abybylijedno/songbook-protocol';
import { getUid } from './cookie';


export const useSessionStore = defineStore('session', () => {
  
  const connectionState: Ref<number> = ref(WebSocket.CLOSED);
  const handshakeSuccessful: Ref<boolean> = ref(false);

  const connectionStateText = computed(() => {
    switch (connectionState.value) {
      case WebSocket.CONNECTING:
        return 'Łączenie...';

      case WebSocket.OPEN:
        return 'Połączono';

      case WebSocket.CLOSING:
        return 'Rozłączanie...';

      case WebSocket.CLOSED:
        return 'Rozłączono';

      default:
        return 'Błąd';
    }
  });

  const isConnected = computed(() => connectionState.value === WebSocket.OPEN);
  const isReady = computed(() => isConnected.value && handshakeSuccessful.value);

  const sessionDetails = ref<ISessionDetails | null>(null);
  const hasSession = computed(() => sessionDetails.value !== null);

  const isSessionCreator = computed(() => {
    if (!hasSession.value) {
      return false;
    }

    return sessionDetails.value!.members[0].user.uid === getUid();
  });

  return {
    connectionState,
    handshakeSuccessful,
    connectionStateText,
    
    isConnected,
    isReady,

    sessionDetails,
    hasSession,
    isSessionCreator
  };
});
