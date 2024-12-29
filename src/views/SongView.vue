<script lang="ts" setup>
import { ref, computed, onActivated, shallowReactive, watch } from 'vue';
import { useRoute } from 'vue-router';

import ViewLayout from '@/components/ViewLayout.vue';

import { DataContainer } from '@/lib/vue/DataContainer';

import { getSong } from '@/lib/client';
import { type ISong } from '@/lib/songs/model';
import SongDetailsMenuButton from '@/lib/songs/view/SongDetailsMenuButton.vue';
import SongDetails from '@/lib/songs/view/SongDetails.vue';

const route = useRoute();

const songHash = ref("");
const container: DataContainer = shallowReactive(new DataContainer());

/**
 * Load the song
 */
const loadSong = async () => {
  if (songHash.value === route.params.songHash) {
    return;
  }

  console.debug("Loading song");
  songHash.value = route.params.songHash as string;
  
  if (songHash.value == null) {
    container.setData(null)
    return;
  }

  const data = await getSong(songHash.value);
  container.setData(data);
};

/**
 * Watch for changes to the song hash
 */
watch(() => route.params.songHash, (newValue) => {
  if (!newValue) {
    return;
  }
  
  console.debug('Song Hash Changed', newValue);
  loadSong();
});

/**
 * When the view is activated, load the song
 */
onActivated(() => {
  console.debug("Activating Song View");
  loadSong();
});


/**
 * Compute Song
 */
const song = computed((): ISong | null => {
  return container.data as ISong;
});

/**
 * Compute Song Title
 */
const songTitle = computed((): string => {
  return container.loading || song.value == null ? "" : song.value.title;
});

</script>

<template>
  <ViewLayout :title="songTitle"
    :loading-enabled="true"
    :loading-state="container.loading">

    <template #toolbar>
      <SongDetailsMenuButton :song="song" />
    </template>

    <template #content>
      <SongDetails :song="song" />
    </template>

  </ViewLayout>
</template>

<style lang="less">

</style>
