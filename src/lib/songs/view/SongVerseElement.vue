<script lang="ts" setup>
import { computed } from 'vue';
import type { PropType } from 'vue';
import type { ISongVerse } from '../model';

import { useOptionsStore } from '@/stores/options';
const optionsStore = useOptionsStore();

import { useSessionStore } from '@/services/session';
const sessionStore = useSessionStore();

const props = defineProps({
  songHash: {
    type: String,
    required: true
  },

  idx: {
    type: Number,
    required: true
  },

  verse: {
    type: Object as PropType<ISongVerse>,
    required: true
  }
});

const showChordsOnLeft = computed(() => optionsStore.showChords === -1);
const showChordsOnRight = computed(() => optionsStore.showChords === 1);

const markCurrent = () => {
  if (!sessionStore.hasSession || !sessionStore.isSessionCreator) {
    return;
  }

  sessionStore.markCurrentSongVerse(props.songHash, props.idx);
};

const isCurrent = computed(() => sessionStore.hasSession && sessionStore.currentSongVerse?.songHash === props.songHash && sessionStore.currentSongVerse?.verseIdx === props.idx);

</script>

<template>
  <table :class="['song-verse', { current: isCurrent }]" @click="markCurrent">
    <tr v-for="line in verse.lines"
      :key="line.uuid">
      <td class="chord" v-if="showChordsOnLeft">{{ line.chord }}</td>
      <td>{{ line.text }}</td>
      <td class="chord" v-if="showChordsOnRight">{{ line.chord }}</td>
    </tr>
  </table>
</template>

<style lang="less">
.song-verse {
  width: calc(100% - 2 * var(--side-margin-v));
  margin: var(--side-margin-h) var(--side-margin-v);
  padding-left: 0.5rem;
  border-left: 3px solid transparent;

  &.current {
    border-color: var(--color-marked);
  }

  td {
    font-size: 110%;

   &.chord {
    width: 20%;
    min-width: 7rem;
    color: var(--color-inferior-text);

    &:first-child {
      text-align: right;
      padding-right: 1rem;
    }

    &:last-child {
      text-align: left;
      padding-left: 1rem;
    }
   }
  }
}
</style>
