import Vue from "vue";
import Router from "vue-router";
import HomePage from "@/components/HomePage.vue";
import DetailPage from "./components/DetailPage.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "HomePage",
      component: HomePage,
    },
    {
      path: "/detail/:id",
      name: "DetailPage",
      component: DetailPage,
      props: true,
    },
  ],
});
