import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { worker } from './mocks/browser';
import App from './App.vue';
import router from './router';

const app = createApp(App);

if (process.env.NODE_ENV === 'development') {
  worker.start();
}

app.use(createPinia());
app.use(router);

app.mount('#app');
