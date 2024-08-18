<script lang="ts" setup>
import "@/assets/components/SongsListElement.less";

import { computed, type PropType } from 'vue';
import { RouterLink } from 'vue-router';
import { useModal } from 'vue-final-modal';
import { useStateStore } from '@/stores/state';

import EntypoIcon from "@/components/elements/EntypoIcon.vue";
import IconButton from '@/components/elements/IconButton.vue';
import MenuModal from '@/components/modals/MenuModal.vue';
import ConfirmModal from '@/components/modals/ConfirmModal.vue';

import { type IPlaylist, type IPlaylistSong } from '../model';
import { removeSongFromPlaylist } from '@/lib/client';

const stateStore = useStateStore();

const props = defineProps({
  playlist: {
    type: Object as PropType<IPlaylist>,
    required: true
  },
  song: {
    type: Object as PropType<IPlaylistSong>,
    required: true
  },
  allowRemove: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits<{
  (e: 'removed', song: IPlaylistSong): void
}>();

const link = computed((): string => {
  return `/playlist/${props.playlist.id}/song/${props.song.hash}`;
});

const hasBeenPlayed = computed((): boolean => {
  if(props.playlist.id == null) {
    return false;
  }

  return stateStore.isPlayed(props.playlist.id, props.song.hash);
});

const getClasses = computed((): string[] => {
  const classes = [
    'playlist-songs-list-element',
    'songs-list-element'
  ];

  if (hasBeenPlayed.value) {
    classes.push('song-played');
  }

  return classes;
});

//#region -------------------- Menu --------------------

/**
 * Instancinate the modal with options for the playlist
 */
const openOptionsModal = useModal({
  component: MenuModal,
  attrs: {
    buttons: [
      {
        title: 'Usuń z playlisty',
        icon: 'Minus',
        color: 'red',
        action: confirmRemove
      }
    ]
  }
});

//#endregion

//#region -------------------- Remove --------------------

/**
 * Instancinate the modal to remove the song from playlist
 */
 const confirmRemoveModal = useModal({
  component: ConfirmModal,
  attrs: {
    question: 'Czy na pewno chcesz usunąć tą piosenkę z playlisty?',
    confirmButtonTitle: 'Usuń',
    confirmButtonIcon: 'Minus',
    confirmButtonColor: 'red',
    onConfirm: onConfirmRemove
  }
})

/**
 * Opens a modal to confirm the removal of the song from playlist
 */
function confirmRemove() {
  confirmRemoveModal.open();
}

/**
 * Execute when used confirmed the removal of the song from playlist
 */
async function onConfirmRemove() {
  if(props.playlist.id == null) {
    throw new Error('Ta playlista nie ma id...');
  }

  await removeSongFromPlaylist(props.playlist.id, props.song.hash);
  emit('removed', props.song)
}

//#endregion

</script>

<template>
  <li :class="getClasses">
    <RouterLink :to="link">
      <strong>{{ song.title }}</strong>
    </RouterLink>
    <IconButton v-if="allowRemove"
      title="Podmenu"
      icon="Menu"
      @click.stop="openOptionsModal.open" />
  </li>
</template>

<style lang="less">
li.playlist-songs-list-element.songs-list-element {
  display: flex;

  &.song-played {
    a {
      color: var(--c-positive-green);
      text-decoration: line-through;
    }
  }

  a {
    flex-grow: 1;
    flex-shrink: 1;
    margin: 0;
    padding: var(--side-margin-h) var(--side-margin-v);
  }

  button {
    flex-grow: 0;
    flex-shrink: 0;
  }
}
</style>
