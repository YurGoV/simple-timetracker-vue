// Composables
import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/store/user";
import { useContextsStore } from "@/store/contexts";
import { useRecordsStore } from "@/store/records";
import { loginUserByToken } from "@/services/auth.service";

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/default/DefaultView.vue"),
    children: [
      {
        path: "",
        name: "Home",
        component: () => import("@/views/HomeView.vue"),
      },
      {
        path: "/about",
        name: "About",
        component: () => import("@/views/AboutApp.vue"),
      },
      {
        path: "/time/:action?/:identifier?",
        name: "Time",
        component: () => import("@/views/TimeView.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/config",
        name: "Config",
        component: () => import("@/views/ConfigView.vue"),
      },
    ],
  },
];

const base = import.meta.env.BASE_URL;

const router = createRouter({
  history: createWebHistory(base),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  // TODO: refactoring to all inside login/current in user store
  const contextsStore = useContextsStore();
  const recordsStore = useRecordsStore();
  const token = localStorage.getItem("token");

  const { isLoggedIn } = userStore;
  if (!isLoggedIn && token) {
    try {
      const { user, gettedContexts, gettedRecords } =
        await loginUserByToken(token);
      userStore.setUser(user);
      contextsStore.setupContexts(gettedContexts);
      recordsStore.setupRecords(gettedRecords);
    } catch (error) {
      // TODO: notify about need to login
      return next({
        name: "Home",
      });
    }
  }
  if (to.meta?.requiresAuth && !userStore.isLoggedIn) {
    return next({
      name: "Home",
    });
  }
  next();
});

export default router;
