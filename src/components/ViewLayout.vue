<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const router = useRoute();

const props = defineProps({
  title: {
    type: String
  },
  loadingEnabled: {
    type: Boolean,
    default: false
  },
  loadingState: {
    type: Boolean,
    default: false
  }
});

const shouldShow = computed((): boolean => {
  return !props.loadingEnabled || !props.loadingState;
});

const hasTitle = computed((): boolean => {
  return props.title != null;
});

const contentClass = computed((): string[] => {
  const classes = [];
  
  // Add to classes current page name from vue router
  const currentRouteName = router.name;
  if (currentRouteName) {
    classes.push(`content-view-${currentRouteName.toString()}`);
  }

  // Add loading class
  if (props.loadingEnabled && props.loadingState) {
    classes.push('loading');
  }

  return classes;
});

</script>

<template>
  <div id="toolbar" :data-show-elements="shouldShow">
    <h1 v-if="hasTitle">{{ shouldShow ? props.title : "Ładowanie..." }}</h1>
    <slot name="toolbar"></slot>
  </div>
  <div id="content" :class="contentClass">
    <div id="content-wrapper">
      <slot v-if="shouldShow" name="content"></slot>
    </div>
  </div>
</template>

<style lang="less">
#toolbar {
  background: #f7f7f7;
  display: flex;
  justify-content: flex-end;

  &[data-show-elements="false"] {
    .icon-button {
      visibility: hidden;
    }
  }

  & > * {
    flex-shrink: 0;
  }

  & > h1 {
    font-size: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-basis: 100%;
    flex-shrink: 1;
  }

  & > button {
    margin: 0;
    height: 3rem;
    border-radius: 0;
    border: 0;
    border-left: 1px solid var(--separator-color);
    padding: 0.5rem;
    background: transparent;

    & > svg {
      width: 2rem;
      height: 2rem;
    }
  }

  form.search-input {
    flex-basis: 100%;
  }
}

@media screen and (orientation: portrait) {
  #toolbar {
    & > button {
      width: 3rem;
      border-left: none;

      & > svg {
        margin: 0;
      }

      & > span {
        display: none;
      }
    }
  }
}

#content {
  overflow: auto;
  position: relative;
}

#content-wrapper {
  max-width: 920px;
}
</style>
