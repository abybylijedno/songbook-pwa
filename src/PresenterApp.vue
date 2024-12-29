<script setup lang="ts">
import { ref, type Ref, onMounted, computed } from 'vue';
import { type IMessage } from '@/services/presenter/IMessage';
import { MessageType } from '@/services/presenter/MessageType';


interface IArea {
  width: number;
  height: number;
  lineHeight: number;
  fontSize: number;
}

const appArea: Ref<null | IArea> = ref(null);
const data: Ref<null | IMessage> = ref(null);

/**
 * Whether the current message is a song verse
 */
const isSongVerse = computed(() => data.value?.type === MessageType.SONG_VERSE);

/**
 * Font size for the song verse
 */
const getSongVerseFontSize = computed(() => {
  if (!isSongVerse.value || !appArea.value) {
    return '';
  }

  // fsNol is a font size by the number of lines
  const nol = data.value?.songVerse?.lines.length || 1;
  const fsNol = Math.floor(appArea.value.height / nol / appArea.value.lineHeight);

  // fsWol is a font size by the width of the line
  const wol = data.value?.songVerse?.lines.reduce((acc, line) => Math.max(acc, line.text.length), 0) || 1;
  const fsWol = Math.floor(1.78 * appArea.value.width / wol);

  const fontSize = Math.min(fsNol, fsWol);
  return `${fontSize}px`;
});

/**
 * Whether the current message is an information message
 */
const isInformation = computed(() => data.value?.type === MessageType.INFORMATION);

// Listen for messages from the parent window
onMounted(() => {
  const refreshAppArea = () => {
    const $app = document.getElementById('app');
    if (!$app) {
      return '';
    }

    const cs = getComputedStyle($app);
    parseInt(cs.paddingTop, 10) || 0

    appArea.value = {
      width: parseInt(cs.width, 10) - parseInt(cs.paddingLeft, 10) - parseInt(cs.paddingRight, 10),
      height: parseInt(cs.height, 10) - parseInt(cs.paddingTop, 10) - parseInt(cs.paddingBottom, 10),
      lineHeight: parseInt(cs.lineHeight) / parseInt(cs.fontSize) + 0.1,
      fontSize: parseInt(cs.fontSize),
    };
  };

  refreshAppArea();
  window.addEventListener('resize', refreshAppArea);

  window.addEventListener('message', (event) => {
      // Only accept messages from the same origin
      if (event.origin !== window.location.origin) {
        return;
      }

      const _data = event.data as IMessage;
      if (_data.type === MessageType.CLEAR) {
        data.value = null;
      } else {
        data.value = _data;
      }

    });
});

</script>

<template>
  <!-- Display song verse -->
  <table v-if="isSongVerse" class="song-verse" :style="{ fontSize: getSongVerseFontSize }">
    <tr v-for="line in data?.songVerse?.lines" :key="line.uuid">
      <td>{{ line.text }}</td>
    </tr>
  </table>

  <!-- Display information message -->
  <p v-else-if="isInformation" class="information">
    {{ data?.information }}
  </p>
</template>

<style lang="less">

</style>
