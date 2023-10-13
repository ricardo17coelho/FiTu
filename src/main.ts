import App from "./App.vue";
import router from "./router";
import { pinia } from "@/stores";
import vuetify from "@/plugins/vuetify";
import axios from "axios";

axios.defaults.baseURL = "https://futdb.app/api";
axios.defaults.headers.common["X-AUTH-TOKEN"] = `${
  import.meta.env.VITE_FUT_DB_API_KEY
}`;

const app = createApp(App);

app.use(router).use(pinia).use(vuetify);
app.mount("#app");
