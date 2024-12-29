<script lang="ts" setup>
import { type PropType } from 'vue';
import { type ISong } from '../model';

import SongVersesList from '@/lib/songs/view/SongVersesList.vue';
import SongMetaContainer from '@/lib/songs/view/SongMetaContainer.vue';
import InfoScreen from '@/components/elements/InfoScreen.vue';

defineProps({
  song: {
    type: Object as PropType<ISong | null>,
    required: true
  }
});
</script>

<template>
  <article v-if="song" class="song-details">
    <SongVersesList :song-hash="song.hash" :verses="song.verses" />
    <SongMetaContainer :meta="song.meta" />
  </article>
  <InfoScreen v-else
    icon="EmojiSad"
    title="Piosenka nie istnieje"
    text="Wygląda na to, że ta piosenka nie istnieje!" />
</template>

<style lang="less">
article.song-details {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  overflow: auto;
}
</style>
