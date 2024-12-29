import { ref, type Ref, computed } from 'vue';
import { defineStore } from 'pinia';

import { type Orientation } from '@/lib/helpers/rwd';


export const useRwdStore = defineStore('rwd', () => {
  
  const getOrientation = (): Orientation => {
    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
  }
  
  const getDiagonal = () => {
    return Math.round(Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2)));
  }

  const orientation: Ref<Orientation> = ref(getOrientation());
  const diagonal: Ref<number> = ref(getDiagonal());

  const isLandscape = computed(() => orientation.value === 'landscape');

  const refresh = () => {
    orientation.value = getOrientation();
    diagonal.value = getDiagonal();
  }
    
  return {
    orientation,
    isLandscape,
    diagonal,
    refresh
  };
});
