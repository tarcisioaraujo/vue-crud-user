import { createApp } from "vue";
import App from "./App.vue";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import { createRouter, createWebHistory } from "vue-router";
import UserList from "./components/pages/UserList";
import UserCreate from "./components/pages/UserCreate";

axios.defaults.baseURL = process.env.VUE_APP_API_URL;
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: UserList },
    { path: "/create", component: UserCreate },
  ],
});

createApp(App).use(router).mount("#app");
