<script setup lang="ts">
import StandardModal from './StandardModal.vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },

  text: {
    type: String,
    required: true
  }
});

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: boolean): void
}>()

</script>

<template>
  <StandardModal
    :title="props.title"
    @update:model-value="val => emit('update:modelValue', val)">

    <p>
      {{ props.text }}
    </p>
  </StandardModal>
</template>
