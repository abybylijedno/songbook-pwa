<script lang="ts" setup>
import { computed } from 'vue';
import { storeToRefs } from "pinia";
import { useModal } from 'vue-final-modal';

import { useOptionsStore } from '@/stores/options';
import { useSessionStore } from '@/services/session';

import ViewLayout from '@/components/ViewLayout.vue';
import ConnectionButton from '@/services/session/ConnectionButton.vue';
import SessionManager from '@/services/session/SessionManager.vue';

const optionsStore = useOptionsStore();
const options = storeToRefs(optionsStore);
const sessionStore = useSessionStore();

const optionsShowChords = computed({
  get() {
    return options.showChords.value.toString();
  },

  set(v: string) {
    options.showChords.value = parseInt(v);
  }
});

</script>

<template>
  <ViewLayout title="Opcje">
    <template #content>
      <h2>Ustawienia</h2>
      <ul>
        <li>
          <label for="option-show-chords">Akordy</label>
          <select id="option-show-chords" v-model="optionsShowChords">
            <option value="0">Ukryj</option>
            <option value="-1">Po lewej</option>
            <option value="1">Po prawej</option>
          </select>
        </li>
      </ul>

      <h2>Sesja</h2>
      <ul>
        <li>
          <label for="option-session-server">Adres serwera</label>
          <input id="option-session-server"
                  type="text"
                  v-model="optionsStore.sessionServer"
                  placeholder="adres-serwera:port">
        </li>
        <li>
          <label for="option-session-username">Twój nickname</label>
          <input id="option-session-username"
                  type="text"
                  v-model="optionsStore.sessionUsername"
                  placeholder="">
        </li>
        <li>
          <label>Stan połączenia: <b>{{ sessionStore.connectionStateText }}</b></label>
          <ConnectionButton />
        </li>
      </ul>

      <SessionManager v-show="sessionStore.isReady" />

    </template>
  </ViewLayout>
</template>

<style scoped lang="less">
  ul {
    margin: var(--side-margin-h) var(--side-margin-v);

    li {
      display: flex;
      align-items: center;
      padding: 0.25rem 0;

      label {
        font-size: 1rem;
        flex-grow: 1;
        margin-right: calc(var(--side-margin-v) / 2);
      }

      select {
        flex-shrink: 0;
      }
    }
  }
</style>
