import App from "./App.vue";
import router from "./router";
import { pinia } from "@/stores";
import vuetify from "@/plugins/vuetify";

const app = createApp(App);


app.use(router).use(pinia).use(vuetify);
app.mount("#app");
