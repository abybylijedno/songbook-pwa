import { ref } from 'vue';
import { defineStore } from 'pinia';
import { } from 'pinia-plugin-persistedstate';

const IS_IP = /(\d{1,3}\.){3}\d{1,3}/;
let defaultSessionServer = '/session-server';
if (location.hostname === 'localhost' || IS_IP.test(location.hostname)) {
  defaultSessionServer = `${location.hostname}:8081`;
}

export const useOptionsStore = defineStore('options', {
  state: () => {
    const showChords = ref(0);

    const sessionServer = ref(defaultSessionServer);
    const sessionUsername = ref('');

    return {
      showChords,
      
      sessionServer,
      sessionUsername
    };
  },
  
  persist: {
    storage: localStorage
  }
});
