import { ref, type Ref, computed } from 'vue';
import { defineStore } from 'pinia';
import {
  type ISessionDetails,
  type ICurrentSongVerse
} from '@abybylijedno/songbook-protocol';
import { getUid } from './cookie';
import { cc } from './index';

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

  const currentSongVerse: Ref<null | ICurrentSongVerse> = ref(null);

  const setCurrentSongVerse = (sv: ICurrentSongVerse): ICurrentSongVerse => {
    currentSongVerse.value = sv;
    return currentSongVerse.value;
  }

  const markCurrentSongVerse = (songHash: string, verseIdx: number) => {
    const sv = setCurrentSongVerse({ songHash, verseIdx });

    if (isReady.value) {
      cc.spreadSongVerse(sv);
    }
  };

  return {
    connectionState,
    handshakeSuccessful,
    connectionStateText,
    
    isConnected,
    isReady,

    sessionDetails,
    hasSession,
    isSessionCreator,

    currentSongVerse,
    setCurrentSongVerse,
    markCurrentSongVerse
  };
});
