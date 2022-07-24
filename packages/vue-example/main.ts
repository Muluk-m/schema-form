import { createApp } from 'vue';
import vant from 'vant';
import App from './App.vue';
// // Toast
// import 'vant/es/toast/style';
// // Dialog
// import 'vant/es/dialog/style';
// // Notify
// import 'vant/es/notify/style';
// // ImagePreview
// import 'vant/es/image-preview/style';
import 'vant/lib/index.css';

const app = createApp(App);
app.use(vant);

app.mount('#app');
