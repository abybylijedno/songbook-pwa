<script lang="ts" setup>
import { computed, withDefaults } from 'vue';
import { type IBasicButton } from './IBasicButton';
import EntypoIcon from './EntypoIcon.vue';

const props = withDefaults(defineProps<IBasicButton>(), {
  color: '',
  main: false,
  disabled: false
});

const _type = computed(() => {
  return props.main ? "submit" : "button";
});

const _class = computed(() => {
  const _class = ["has-icon"];

  if (props.color != null) {
    _class.push(props.color);
  }

  return _class;
});

</script>

<template>
  <button :type="_type" :class="_class" :title="title" :disabled="disabled">
    <EntypoIcon :name="icon" /><span>{{ title }}</span>
  </button>
</template>

<style lang="less">
button {
  outline: 0;
  background: white;
  border: 1px solid var(--c-grey);
  padding: 0.75rem 1.25rem;
  color: var(--c-grey);
  cursor: pointer;
  border-radius: 3px;
  line-height: 1;

  * {
    display: inline-block;
    vertical-align: middle;
  }

  &.has-icon {
    padding: 0.75rem 1.25rem 0.75rem 0.75rem;

    svg {
      margin-right: 0.5em;
    }

    span {
      padding-top: 0.1em;
    }
  }

  & + button {
    margin-left: 1rem;
  }

  &.green {
    border-color: var(--c-positive-green);

    * {
      color: var(--c-positive-green);
      font-weight: bold;
    }
  }

  &.red {
    border-color: var(--c-danger-red);
    color: var(--c-danger-red);
    font-weight: bold;
  }

  &.blue {
    border-color: var(--c-palatinate-blue);
    color: var(--c-palatinate-blue);
  }
}
</style>
