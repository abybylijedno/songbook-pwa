import './assets/app.css';

import { createApp } from 'vue';
import { createVfm } from 'vue-final-modal';
import App from './App.vue';
import router from './router';
import popups from './plugins/popups';
import sessionPlugin from './services/session/plugin';
import presenterPlugin from './services/presenter/plugin';

import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const vfm = createVfm()

app.use(pinia);
app.use(router);
app.use(vfm);
app.use(popups);
app.use(sessionPlugin, { router });
app.use(presenterPlugin);

app.mount('#app');
