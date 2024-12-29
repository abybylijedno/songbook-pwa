import { usePresenterStore } from "./store";

interface WindowFeatures {
  toolbar: boolean;
  menubar: boolean;
  status: boolean;
  resizable: boolean;
  scrollbars: boolean;
  location: boolean;
  width: number;
  height: number;
}

/**
 * Get a string representation of the window features
 * 
 * @param features 
 * @returns 
 */
const getWindowFeaturesString = (features: WindowFeatures) => {
  return Object.entries(features)
    .map(([key, value]) => {
      let str = key + '=';
      if (typeof value === 'boolean') {
        str += value ? 'yes' : 'no';
      } else {
        str += `${value}`;
      }
      return str;
    })
    .join(',');
}

/**
 * Open the presenter window
 */
export const openPresenterWindow = async (): Promise<Window | null> => {
  const presenterStore = usePresenterStore();
  
  return new Promise((resolve, reject) => {
    if (presenterStore.isChildWindowOpen) {
      reject('The presenter window is already open');
      return;
    }

    const presenterWindow = window.open(
      'presenter.html',
      'PresenterWindow',
      getWindowFeaturesString({
        toolbar: false,
        menubar: false,
        status: false,
        resizable: true,
        scrollbars: false,
        location: false,
        width: window.outerWidth,
        height: window.outerHeight
      })
    );

    if (presenterWindow) {
      let checkPresenterWindowInterval: number | null = null;

      const clearPresenterWindow = () => {
        if (checkPresenterWindowInterval !== null) {
          clearInterval(checkPresenterWindowInterval);
        }

        presenterStore.setChildWindow(null);
      };

      presenterWindow.addEventListener('load', () => {
        // Focus the presenter window
        presenterWindow.focus();

        resolve(presenterWindow);
      });

      // Handle the presenter window closing
      presenterWindow.addEventListener('beforeunload', clearPresenterWindow);

      // Also check if the presenter window is closed
      checkPresenterWindowInterval = setInterval(() => {
        if (presenterWindow.closed) {
          clearPresenterWindow();
        }
      }, 500);

      // Close the presenter window when the main window is closed
      window.addEventListener('beforeunload', () => {
        presenterWindow.close();
      });

    } else {
      reject('Failed to open the presenter window');
    }

    // Store the presenter window
    presenterStore.setChildWindow(presenterWindow);
  });
};
