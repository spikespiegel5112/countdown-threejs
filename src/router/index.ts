import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
  RouteRecordRaw,
} from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "App",
    component: () =>
      import(/* webpackChunkName: "App" */ "../App.vue"),
  },
  {
    path: "/main",
    name: "Layout",
    component: () =>
      import(/* webpackChunkName: "Layout" */ "../views/Layout.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
export default router;
