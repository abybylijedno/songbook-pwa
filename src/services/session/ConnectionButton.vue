<script setup lang="ts">
import { computed } from 'vue';
import { cc } from './index';

import BasicButton from '@/components/elements/BasicButton.vue';

import { useSessionStore } from './store';
const store = useSessionStore();

const handleClick = () => {
  if (store.connectionState === WebSocket.CLOSED) {
    cc.connect();
  } else if (store.connectionState === WebSocket.OPEN) {
    cc.disconnect();
  }
};

const isButtonDisabled = computed(() => {
  return store.connectionState !== WebSocket.OPEN && store.connectionState !== WebSocket.CLOSED;
});

const buttonText = computed(() => {
  switch(store.connectionState) {
    case WebSocket.CONNECTING:
      return 'Łączenie...';

    case WebSocket.OPEN:
      return 'Rozłącz';

    case WebSocket.CLOSING:
      return 'Rozłączanie...';
    
    case WebSocket.CLOSED:
      return 'Połącz';

    default:
      return 'Błąd';
  }
});

const buttonColor = computed(() => {
  return store.isConnected ? 'red' : 'blue';
});

</script>

<template>
  <BasicButton
    :title="buttonText"
    icon="Link"
    :color="buttonColor"
    :disabled="isButtonDisabled"
    @click="handleClick" />
</template>
