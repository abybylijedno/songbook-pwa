<script lang="ts" setup>
import { ref, computed, onActivated, shallowReactive } from 'vue';
import { useRoute, onBeforeRouteUpdate, type RouteLocationNormalizedLoaded } from 'vue-router';

import { storeToRefs } from "pinia";
import { useRwdStore } from '@/stores/rwd';
import { useStateStore } from '@/stores/state';

import ViewLayout from '@/components/ViewLayout.vue';
import BasicButton from '@/components/elements/BasicButton.vue';

import { DataContainer } from '@/lib/vue/DataContainer';

import { getSong, getPlaylist, getPlaylistSongs } from '@/lib/client';

import SongDetailsMenuButton from '@/lib/songs/view/SongDetailsMenuButton.vue';
import SongDetails from '@/lib/songs/view/SongDetails.vue';

import { type IPlaylist, type IPlaylistSong } from '@/lib/playlists/model';
import PlaylistSongsList from '@/lib/playlists/view/PlaylistSongsList.vue';

const route = useRoute();

const { isLandscape, diagonal } = storeToRefs(useRwdStore());
const stateStore = useStateStore();

const playlistId = ref(-1);
const playlistData: DataContainer = shallowReactive(new DataContainer());
const playlist = computed((): IPlaylist | null => playlistData.data as IPlaylist);
const playlistSongsData: DataContainer = shallowReactive(new DataContainer());
const playlistSongs = computed((): IPlaylistSong[] | null => playlistSongsData.data as IPlaylistSong[]);

const songHash = ref("");
const songData: DataContainer = shallowReactive(new DataContainer());
const song = computed((): IPlaylistSong | null => songData.data as IPlaylistSong);

/**
 * Compute Song Title
 */
const songTitle = computed((): string => {
  return songData.loading || song.value == null ? "" : song.value.title;
});

/**
 * Should show playlist songs list?
 */
const shouldShowPlaylistSongsList = computed((): boolean => isLandscape.value && diagonal.value >= 1000 );

/**
 * Has the song been played?
 */
const hasBeenPlayed = computed((): boolean => {
  if (playlistId.value == null || playlistId.value < 0 || songHash.value == "") {
    return false;
  }

  return stateStore.isPlayed(playlistId.value, songHash.value);
});

/**
 * Handle the route location
 */
function handleRouteLocation(routeLocation: RouteLocationNormalizedLoaded) {
  const _playlistId = parseInt(routeLocation.params.playlistId as string);
  const _songHash = routeLocation.params.songHash as string;

  if (_playlistId !== playlistId.value) {
    playlistId.value = _playlistId;
    playlistData.setData(null);
    playlistSongsData.setData(null);
  }

  if (_songHash !== songHash.value) {
    songHash.value = _songHash;
    songData.setData(null);
  }

  refresh();
}

/**
 * When the view is activated, load the song from the worker
 */
onActivated(() => {
  handleRouteLocation(route);
});

/**
 * When the route is updated, load the song from the worker
 */
onBeforeRouteUpdate((to, from, next) => {
  handleRouteLocation(to);
  next();
});

function refresh() {
  if (shouldShowPlaylistSongsList.value) {
    if (playlistId.value != null) {
      if (playlistData.data == null) {
        getPlaylist(playlistId.value).then((data) => {
          playlistData.setData(data);
        });
      }

      if (playlistSongsData.data == null) {
        getPlaylistSongs(playlistId.value).then((data) => {
          playlistSongsData.setData(data);
        });
      }
    }
  }
  
  if (songData.data == null) {
    getSong(songHash.value).then((data) => {
      songData.setData(data);
    });
  }
}

function markAsPlayed() {
  if (song.value == null || hasBeenPlayed.value) {
    return;
  }
  
  stateStore.markAsPlayed(playlistId.value, song.value.hash);
}

function unmarkAsPlayed() {
  if (song.value == null || !hasBeenPlayed.value) {
    return;
  }
  
  stateStore.unmarkAsPlayed(playlistId.value, song.value.hash);
}

</script>

<template>
  <ViewLayout :title="songTitle"
    :loading-enabled="true"
    :loading-state="songData.loading">

    <template #toolbar>
      <BasicButton v-if="hasBeenPlayed" title="Oznacz jako niezagraną" icon="Ccw" color="blue" @click.prevent="unmarkAsPlayed" />
      <BasicButton v-else title="Oznacz jako zagraną" icon="Check" color="blue" @click.prevent="markAsPlayed" />
      <SongDetailsMenuButton :song="song" />
    </template>

    <template #content>
      <div id="playlist-song-view-container" :data-songs-list="shouldShowPlaylistSongsList">
        <SongDetails v-if="song" :song="song" />
        <div v-else class="loading"></div>
        <PlaylistSongsList v-if="shouldShowPlaylistSongsList && playlist && playlistSongs"
          :playlist="playlist"
          :songs="playlistSongs"
          :allow-remove="false" />
      </div>
    </template>

  </ViewLayout>
</template>

<style lang="less">
#playlist-song-view-container {
  display: grid;
  height: 100%;
  grid-template-columns: 100%;
  grid-template-rows: 100%;

  &[data-songs-list="true"] {
    grid-template-columns: 1fr 35%;
  }

  .playlist-songs-list {
    background: var(--c-anti-flash-white);

    li {
      a {
        strong {
          font-weight: normal
        }

        &.router-link-active {
          background: white;
        }

        &:not(.router-link-active) {
          color: var(--color-inferior-text);
        }
      }
    }
  }
}
</style>
