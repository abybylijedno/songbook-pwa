import { useSessionStore } from "./store";
import { watch } from "vue";
import { type Router } from "vue-router";

export default {
  install: (_app: any, { router }: { router: Router }) => {
    const store = useSessionStore();

    watch(
      () => store.currentSongVerse,
      (newValue) => {
        const route = router.currentRoute.value;      

        if (newValue === null || !["home", "song"].includes(route.name as string)) {
          return;
        }

        const { songHash, verseIdx } = newValue;
        if (songHash === route.params.songHash) {
          return;
        }

        router.push(`/song/${songHash}`);
      }
    );
  }
}
