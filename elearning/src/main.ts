import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { worker } from './mocks/browser';
import App from './App.vue';
import router from './router';

import BalmUI from 'balm-ui'; // Official Google Material Components
import BalmUIPlus from 'balm-ui/dist/balm-ui-plus'; // BalmJS Team Material Components
import 'balm-ui-css';

const app = createApp(App);

if (process.env.NODE_ENV === 'development') {
	worker.start();
}

app.use(BalmUI);
app.use(BalmUIPlus);
app.use(createPinia());
app.use(router);

app.mount('#app');
