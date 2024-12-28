<script lang="ts" setup>
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import EntypoIcon from '../elements/EntypoIcon.vue';

const route = useRoute();

const props = defineProps({
  link: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  activeMatchPath: {
    type: String
  }
});

const routerLinkClasses = computed(() => {
  const classes: string[] = [];

  if (props.activeMatchPath) {
    const regexp = new RegExp(props.activeMatchPath);
    if (regexp.test(route.path)) {
      classes.push('active');
    }
  }

  return classes;
});

</script>

<template>
  <li>
    <RouterLink :to="link" active-class="active" :class="routerLinkClasses">
      <EntypoIcon :name="icon" />
      <span>{{ text }}</span>
    </RouterLink>
  </li>
</template>

<style lang="less">
#main-menu > ul > li {
  text-align: center;
  flex-grow: 0;
  overflow: hidden;

  a {
    display: block;
    width: 100%;
    height: 100%;
    text-decoration: none;
    border-top: 1px solid var(--navigation-border);

    &:link,
    &:visited {
      color: var(--navigation-button-text);
    }

    &.active {
      background: var(--navigation-button-active-background);
      color: var(--navigation-button-active-text);
    }

    svg {
      display: inline-block;
      width: 1.5rem;
      height: 1.5rem;
      margin-top: 0.75rem;
    }

    span {
      display: block;
      width: 100%;
    }
  }

}

@media screen and (orientation: landscape) {
  #main-menu > ul > li {
    height: 5rem;

    a {
      padding-top: 0.25rem;
    }
  }
}

@media screen and (orientation: portrait) {
  #main-menu > ul > li {
    flex-basis: 6rem;
    flex-shrink: 1;
  }
}

</style>
