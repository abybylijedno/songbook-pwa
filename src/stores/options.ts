import { ref } from 'vue';
import { defineStore } from 'pinia';
import { } from 'pinia-plugin-persistedstate';

export const useOptionsStore = defineStore('options', {
  state: () => {
    const showChords = ref(0);

    const sessionServer = ref('localhost:8081');
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
