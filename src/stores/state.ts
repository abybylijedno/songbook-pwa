import { ref, type Ref } from 'vue';
import { defineStore } from 'pinia';
import { } from 'pinia-plugin-persistedstate';

interface PlayedSongEntry {
  playlistId: number;
  songHash: string;
}

export const useStateStore = defineStore('state', {
  state: () => {
    const lastSongPath: Ref<null | string> = ref(null);
    const playedSongs: Ref<PlayedSongEntry[]> = ref<PlayedSongEntry[]>([]);

    function isPlayed(playlistId: number, songHash: string) {
      return playedSongs.value.some(
        (entry) => entry.playlistId === playlistId && entry.songHash === songHash
      );
    }

    function markAsPlayed(playlistId: number, songHash: string) {
      if (isPlayed(playlistId, songHash)) { return; }

      playedSongs.value.push({ playlistId, songHash });
    }

    function unmarkAsPlayed(playlistId: number, songHash: string) {
      const idx = playedSongs.value.findIndex(
        (entry) => entry.playlistId === playlistId && entry.songHash === songHash
      );
      if (idx !== -1) {
        playedSongs.value.splice(idx, 1);
      }
    }

    function resetPlaylist(playlistId: number) {
      for (let i = playedSongs.value.length - 1; i >= 0; i--) {
        if (playedSongs.value[i].playlistId === playlistId) {
          playedSongs.value.splice(i, 1);
        }
      }
    }
    
    return {
      lastSongPath,
      playedSongs,
      isPlayed,
      markAsPlayed,
      unmarkAsPlayed,
      resetPlaylist
    };
  },
  
  persist: {
    storage: sessionStorage
  }
});
