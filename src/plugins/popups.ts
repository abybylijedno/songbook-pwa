import { bus } from '@/services/event-bus';
import { useModal } from 'vue-final-modal';
import TextModal from '@/components/modals/TextModal.vue';

export default {
  install: () => {

    //#region Session has been deleted
    const sessionHasBeenDeletedModal = useModal({
      component: TextModal,
      attrs: {
        title: "Sesja zakończona",
        text: "Sesja została usunięta przez prowadzącego"
      },
    });

    bus.on('session-deleted', () => {
      sessionHasBeenDeletedModal.open();
    });
    //#endregion

    //#region Session has expired
    const sessionHasExpiredModal = useModal({
      component: TextModal,
      attrs: {
        title: "Sesja zakończona",
        text: "Sesja została zakończona z powodu nieaktywności prowadzącego przez dłuższy czas"
      },
    });

    bus.on('session-expired', () => {
      sessionHasExpiredModal.open();
    });
    //#endregion
    
  }
}
