<script lang="ts" setup>
import { onActivated, ref, type Ref, shallowReactive, computed } from 'vue';
import { useRoute } from 'vue-router';
import { DataContainer } from '@/lib/vue/DataContainer';

import ViewLayout from '@/components/ViewLayout.vue';
import InfoScreen from '@/components/elements/InfoScreen.vue';

import { getPlaylist, getPlaylistSongs } from '@/lib/client';

import { type IPlaylist, type IPlaylistSong } from '@/lib/playlists/model';
import PlaylistSongsList from '@/lib/playlists/view/PlaylistSongsList.vue';

const route = useRoute();
const playlistId: Ref<number | null> = ref(-1);

const playlist: DataContainer = shallowReactive(new DataContainer());
const songs: DataContainer = shallowReactive(new DataContainer());

const isLoading = computed(() => playlist.loading || songs.loading);
const areSongs = computed(() => {
  return (songs.data as IPlaylistSong[]).length > 0;
});

const getTitle = computed(() => {
  if (playlist.data == null) {
    return "404";
  }

  return (playlist.data as IPlaylist).name;
});

function getCurrentIdFromUrl() {
  return parseInt(route.params.playlistId as string);
}

onActivated(() => {
  playlistId.value = getCurrentIdFromUrl();
  refresh();
});

async function refresh() {
  playlist.setLoading(true);
  songs.setLoading(true);

  if (playlistId.value === null) {
    return;
  }

  const p = await getPlaylist(playlistId.value);

  if (p == null || p.id == null) {
    return;
  }

  playlist.setData(p);
  
  const _songs = await getPlaylistSongs(p.id);
  songs.setData(_songs);
}

function whenSongRemoved(song: IPlaylistSong) {
  songs.setData((songs.data as IPlaylistSong[]).filter((s) => s.hash !== song.hash));
}

</script>

<template>
  <ViewLayout
    :title="getTitle"
    :loading-enabled="true"
    :loading-state="isLoading">

    <template #content>
        <!-- <SearchBar @input="setSearch" /> -->
        <PlaylistSongsList v-if="areSongs"
          :playlist="(playlist.data as IPlaylist)"
          :songs="(songs.data as IPlaylistSong[])"
          @itemremoved="whenSongRemoved" />
        <InfoScreen v-else
          icon="InfoWithCircle"
          title="Playlista jest pusta"
          text="Wygląda na to, że w tej playliście nie ma jeszcze żadnej piosenki" />
    </template>

  </ViewLayout>
</template>

<style lang="less" scoped>
// div {
//   display: grid;
//   grid-template-columns: 1fr;
//   grid-template-rows: 3rem 1fr;
//   grid-template-areas: 'search-bar' 'song-list';

//   form {
//     grid-area: search-bar;
//   }

//   ul {
//     grid-area: song-list;
//   }
// }
</style>
