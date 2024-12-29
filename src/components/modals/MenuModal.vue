<script setup lang="ts">
import { type PropType } from 'vue';

import StandardModal from './StandardModal.vue';
import BasicButton from '../elements/BasicButton.vue';
import { type IBasicButton } from '../elements/IBasicButton';

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: boolean): void
}>()

const props = defineProps({
  buttons: Array as PropType<IBasicButton[]>
});

function handleClickOnButton(button: IBasicButton) {
  if (button.action != null) {
    button.action();
  } else {
    console.warn('No action defined for button', button.title);
  }
  emit('update:modelValue', false);
}

</script>

<template>
  <StandardModal
    id="menu-modal"
    close-text="Zamknij"
    extraWindowClass="menu-modal"
    @update:model-value="val => emit('update:modelValue', val)">

    <BasicButton v-for="button in props.buttons"
      :key="button.title"
      :title="button.title"
      :icon="button.icon"
      :color="button.color"
      :main="button.main"
      v-show="button.show !== false"
      @click.prevent="handleClickOnButton(button)" />

  </StandardModal>
</template>

<style lang="less">
.menu-modal {
  width: 15rem;

  button {
    width: 100%;
    
    & + button {
      margin-left: 0;
      margin-top: 0.5rem;
    }
  }
}
</style>
