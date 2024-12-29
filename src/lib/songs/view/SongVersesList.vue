<script lang="ts" setup>
import type { ISongVerse } from '../model';
import SongVerseElement from './SongVerseElement.vue';

defineProps({
  songHash: {
    type: String,
    required: true
  },

  verses: {
    type: Array<ISongVerse>,
    required: true
  }
});
</script>

<template>
  <div class="song-verses">
    <SongVerseElement v-for="(verse, idx) of verses"
      :key="verse.uuid"
      :song-hash="songHash"
      :idx="idx"
      :verse="verse" />
  </div>
</template>
