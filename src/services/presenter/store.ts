import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const usePresenterStore = defineStore('presenter', () => {
  
  const childWindow = ref<Window | null>(null);
  const isChildWindowOpen = computed(() => childWindow.value !== null);
  const setChildWindow = (window: Window | null) => {
    childWindow.value = window;
  };

  return {
    childWindow,
    isChildWindowOpen,
    setChildWindow
  };
});
