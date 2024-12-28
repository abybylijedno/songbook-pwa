<script setup lang="ts">
import { ref, type PropType } from 'vue';

import StandardModal from './StandardModal.vue';
import BasicButton from '../elements/BasicButton.vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: ''
  },
  startValue: {
    type: String,
    default: ''
  },

  onSubmit: {
    type: Function as PropType<(val: any) => Promise<any>>,
    required: true
  },
  submitButtonTitle: {
    type: String,
    default: 'OK'
  },
  submitButtonIcon: {
    type: String,
    default: 'Check'
  },
  submitButtonColor: {
    type: String,
    default: 'green'
  }
});

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: boolean): void
}>()

const val = ref(props.startValue);

function submit() {
  props.onSubmit(val.value.trim()).then(() => {
    emit('update:modelValue', false)
  }).catch((e: any) => {
    const msg = e instanceof Error ? e.message : e;
    alert("Wystąpił błąd: " + msg);
  });
}

</script>

<template>
  <StandardModal
    close-text="Anuluj"
    @update:model-value="val => emit('update:modelValue', val)">

    <p class="input-container">
      <label for="input-val">{{ props.title }}</label>
      <input type="text" id="input-val" v-model="val" :placeholder="props.placeholder" />
    </p>

    <template #footer>
      <BasicButton
        :main="true"
        :title="props.submitButtonTitle"
        :icon="props.submitButtonIcon"
        :color="submitButtonColor"
        @click.prevent="submit" />
    </template>

  </StandardModal>
</template>
