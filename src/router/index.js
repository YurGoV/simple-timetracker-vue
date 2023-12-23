// Composables
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/default/Default.vue"),
    children: [
      {
        path: "",
        name: "Home",
        // route level code-splitting
        // this generates a separate chunk (Home-[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import("@/views/HomeView.vue"),
      },
    ],
  },
];

const base = import.meta.env.BASE_URL;

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHistory(base),
  routes,
});

export default router;
