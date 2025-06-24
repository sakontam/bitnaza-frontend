// main.js
import { createApp } from 'vue';
import App from './App.vue';

import { createPinia } from 'pinia'; // ✅ เพิ่ม Pinia
const pinia = createPinia();        // ✅ สร้าง Pinia instance

// FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faGem, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { faBitcoin } from '@fortawesome/free-brands-svg-icons';
library.add(faBitcoin, faGem, faDollarSign);

// สร้างแอป
const app = createApp(App);

app.use(pinia); // ✅ ลงทะเบียน Pinia กับแอป

app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');
