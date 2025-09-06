import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import OBR from "@owlbear-rodeo/sdk";
import { setupContextMenu } from './owlbear/contextMenu';



OBR.onReady(() => {
  setupContextMenu();
});

createApp(App).mount('#app')
