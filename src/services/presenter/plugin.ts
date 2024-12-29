import { watch } from "vue";
import { useSessionStore } from "../session/store";
import { usePresenterStore } from "./store";
import { MessageType } from "./MessageType";
import { type IMessage } from "./IMessage";
import { getSong } from '@/lib/client';


export default {
  install: () => {
    const sessionStore = useSessionStore();
    const presenterStore = usePresenterStore();

    const sendMessage = (message: IMessage) => {
      if (!presenterStore.childWindow) {
        return;
      }

      presenterStore.childWindow.postMessage(message, window.location.origin);
    };

    watch(
      () => sessionStore.currentSongVerse,
      async (newValue) => {  
        if (!presenterStore.isChildWindowOpen) {
          return;
        }

        if (newValue === null) {
          console.debug('Clearing presenter window');
          sendMessage({
            type: MessageType.CLEAR
          });

        } else {
          const song = await getSong(newValue.songHash);
          if (!song) {
            console.error('Failed to get song', newValue.songHash);
            return;
          }

          const songVerse = song.verses[newValue.verseIdx];

          console.debug('Presenting verse', songVerse);
          sendMessage({
            type: MessageType.SONG_VERSE,
            songVerse
          });
        }
      }
    );
  }
}
