<script setup lang="ts">
import { ref, computed, type TransitionProps } from 'vue';
import { VueFinalModal } from 'vue-final-modal'

const props = defineProps({
  title: {
    type: String,
    required: false
  },
  closeText: {
    type: String,
    default: 'OK'
  },
  extraWindowClass: {
    type: String
  }
});

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: boolean): void,
  (e: 'before-open'): void,
  (e: 'opened'): void,
  (e: 'close'): void,
  (e: 'before-close'): void,
  (e: 'closed'): void
}>()

const ModalWindowTransition = ref<TransitionProps>({
  name: 'modal-window',
  css: true
});

const contentClass = computed(() => {
  const classes = ['modal-window'];
  if (typeof props.extraWindowClass == "string" && props.extraWindowClass.length > 0) {
    classes.push(props.extraWindowClass);
  }
  return classes;
});

function close() {
  emit('close');
  emit('update:modelValue', false);
}

</script>

<template>
  <VueFinalModal
    class="modal"
    :click-to-close="false"
    :esc-to-close="false"
    overlay-transition="vfm-fade"
    overlay-class="modal-backdrop"
    :content-transition="ModalWindowTransition"
    :content-class="contentClass"
    @before-open="() => emit('before-open')"
    @opened="() => emit('opened')"
    @before-close="() => emit('before-close')"
    @closed="() => emit('closed')"
    @update:model-value="val => emit('update:modelValue', val)">

    <div v-if="props.title" class="modal-header">
      <h1>{{ props.title }}</h1>
    </div>

    <div class="modal-content">
      <slot></slot>
    </div>

    <div class="modal-footer">
      <slot name="footer"></slot>
      <button @click="close">{{ props.closeText }}</button>
    </div>

  </VueFinalModal>
</template>
