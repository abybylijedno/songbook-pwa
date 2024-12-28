<script setup lang="ts">
import { ref, computed, type ComputedRef } from 'vue';
import { cc } from './index';
import { SessionMemberRole } from '@abybylijedno/songbook-protocol';

import { useModal } from 'vue-final-modal';
import PromptModal from '@/components/modals/PromptModal.vue';
import ConfirmModal from '@/components/modals/ConfirmModal.vue';
import BasicButton from '@/components/elements/BasicButton.vue';
import EntypoIcon from '@/components/elements/EntypoIcon.vue';

import { useSessionStore } from './store';
const store = useSessionStore();

/**
 * This state disabled both buttons when true.
 */
let buttonDisabled = ref(false);

/**
 * Code validation regexp.
 */
const CODE_VALIDATION_REGEXP = /^\d{8}$/;

/**
 * Join session by code.
 * 
 * @param code 
 */
const joinSession = async (code: string) => {
  buttonDisabled.value = true;

  code = code.trim();
  if (!CODE_VALIDATION_REGEXP.test(code)) {
    buttonDisabled.value = false;
    throw new Error("Kod sesji powinien składać się z 8 cyfr.");
  }

  try {
    await cc.sessionJoin(code);
  } finally {
    buttonDisabled.value = false;
  }
};

/**
 * Modal for joining session.
 */
const joinSessionModal = useModal({
  component: PromptModal,
  attrs: {
    title: "Podaj kod sesji od prowadzącego",
    placeholder: "Kod sesji powinien mieć 8 cyfr",

    submitButtonTitle: "Dołącz",
    submitButtonColor: "green",
    submitButtonIcon: "Login",

    onSubmit: joinSession
  }
});

/**
 * Create new session.
 */
const createSession = async () => {
  buttonDisabled.value = true;

  try {
    await cc.sessionCreate();
  } finally {
    buttonDisabled.value = false;
  }
};

/**
 * Delete current session.
 */
const deleteSession = async () => {
  buttonDisabled.value = true;

  try {
    await cc.sessionDelete();
  } finally {
    buttonDisabled.value = false;
  }
};

/**
 * Modal for deleting session.
 */
const deleteSessionModal = useModal({
  component: ConfirmModal,
  attrs: {
    question: 'Czy na pewno chcesz usunąć sesję? Wszyscy jej uczestnicy zostaną od niej odłączeni.',
    confirmButtonTitle: 'Usuń',
    confirmButtonIcon: 'Trash',
    confirmButtonColor: 'red',
    onConfirm: deleteSession
  }
});

/**
 * Leave current session.
 */
const leaveSession = async () => {
  buttonDisabled.value = true;

  try {
    await cc.sessionLeave();
  } finally {
    buttonDisabled.value = false;
  }
};

/**
 * Modal for leaving session.
 */
const leaveSessionModal = useModal({
  component: ConfirmModal,
  attrs: {
    question: 'Czy na pewno chcesz opuścić sesję?',
    confirmButtonTitle: 'Opuść',
    confirmButtonIcon: 'LogOut',
    confirmButtonColor: 'red',
    onConfirm: leaveSession
  }
});


interface IMember {
  key: number;
  name: string;
  isCreator: boolean;
}

const members: ComputedRef<IMember[]> = computed(() => {
  const _members: IMember[] = [];
  
  if (store.sessionDetails) {
    for (let idx = 0; idx < store.sessionDetails.members.length; idx++) {
      const _member = store.sessionDetails.members[idx];
      if (!_member) continue;

      _members.push({
        key: idx,
        name: _member.user.name ?? "Osoba bezimienna",
        isCreator: _member.role === SessionMemberRole.Creator
      });
      
    }
  }

  return _members;
});

</script>

<template>
  <div id="session-manager">
    <!-- Session details block -->
    <div v-if="store.hasSession" class="session-details">

      <!-- Session ID -->
      <div class="session-id">
        <p>Kod sesji:</p>
        <p class="session-code">{{ store.sessionDetails?.id }}</p>
      </div>

      <!-- Session control -->
      <div class="session-control">
        <BasicButton
          v-if="store.isSessionCreator"
          title="Usuń sesję"
          icon="Trash"
          color="red"
          @click="deleteSessionModal.open" />
        <BasicButton
          v-else
          title="Opuść sesję"
          icon="LogOut"
          color="red"
          @click="leaveSessionModal.open" />
      </div>

      <!-- Session members -->
      <div class="session-members">
        <p>Członkowie:</p>
        <ul>
          <li v-for="member in members" :key="member.key">
            <span>{{ member.name }}</span>
            <EntypoIcon v-if="member.isCreator" name="Star" />
          </li>
        </ul>
      </div>

    </div>

    <!-- No session block -->
    <div v-else class="no-session">
      <p>Nie jesteś członkiem żadnej sesji.</p>
      <p>
        <BasicButton
          title="Dołącz do sesji"
          icon="Login"
          color="green"
          :disabled="buttonDisabled"
          @click="joinSessionModal.open" />

        <span>&nbsp;lub&nbsp;</span>

        <BasicButton
          title="Utwórz sesję"
          icon="Notification"
          color="blue"
          :disabled="buttonDisabled"
          @click="createSession" />
      </p>
    </div>
  </div>
</template>

<style lang="less" scoped>
@gap: 1rem;

#session-manager {
  margin: var(--side-margin-h) var(--side-margin-v);
  padding: @gap;
  background: var(--c-anti-flash-white);

  p {
      font-size: 1rem;
      margin: 0;
  }

  p + p {
    margin-top: 0.5em;
  }

  .session-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    grid-gap: @gap;
  }

  .session-id {
    grid-area: session-id;
    text-align: center;
    padding-bottom: @gap;
    
    .session-code {
      font-size: 1.5rem;
      font-weight: bold;
    }
  }

  .session-control {
    grid-area: session-control;
    text-align: center;
  }

  .session-members {
    grid-area: session-members;
    padding-left: @gap;
    
    ul {
      padding: 0;
      margin: 0;
      list-style-type: none;

      li {
        padding: 0em 0.5em;

        svg {
          color: #b84e00;
          font-size: 0.8em;
          margin-left: 0.3em;
        }
      }
    }

  }

  .no-session > p {
    text-align: center;
  }
}

@media screen and (orientation: landscape) {
  #session-manager {
    .session-details {
      grid-template-areas:
        "session-id session-members"
        "session-control session-members";
    }

    .session-id {
      border-bottom: 1px solid var(--c-dark-platinum);
    }

    .session-members {
      border-left: 1px solid var(--c-dark-platinum);
    }
  }
}

@media screen and (orientation: portrait) {
  #session-manager {
    .session-details {
      grid-template-areas:
        "session-id session-control"
        "session-members session-members";
    }

    .session-id,
    .session-control {
      border-bottom: 1px solid var(--c-dark-platinum);
    }

    .no-session > p > span {
      display: block;
      text-align: center;
    }

  }
}
</style>
