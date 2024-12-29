<script setup lang="ts">
import { ref, type Ref, onMounted, computed } from 'vue';
import { type IMessage } from '@/services/presenter/IMessage';
import { MessageType } from '@/services/presenter/MessageType';

const data: Ref<null | IMessage> = ref(null);

/**
 * Whether the current message is a song verse
 */
const isSongVerse = computed(() => data.value?.type === MessageType.SONG_VERSE);

/**
 * Whether the current message is an information message
 */
const isInformation = computed(() => data.value?.type === MessageType.INFORMATION);

// Listen for messages from the parent window
onMounted(() => {
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
  <table v-if="isSongVerse" class="song-verse">
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
main {
  display: grid;

  & > * {
    align-self: center;
    justify-self: left;
  }
}

</style>
