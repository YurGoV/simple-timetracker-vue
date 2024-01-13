// Composables
import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/store/user";
import { useContextsStore } from "@/store/contexts";
import { useRecordsStore } from "@/store/records";

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/default/Default.vue"),
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
        path: "/time",
        name: "Time",
        component: () => import("@/views/TimeView.vue"),
        meta: { requiresAuth: true },
      },
      // {
      //   path: "/add",
      //   name: "AddTime",
      //   component: () => import("@/views/AddTime.vue"),
      //   meta: { requiresAuth: true },
      // },
    ],
  },
];

const base = import.meta.env.BASE_URL;

const router = createRouter({
  history: createWebHistory(base),
  routes,
});

router.beforeEach(async (to) => {
  const userStore = useUserStore();
  // TODO: refactoring to all inside login/current in user store
  const contextsStore = useContextsStore();
  const recordsStore = useRecordsStore();
  const token = localStorage.getItem("token");
  // await userStore.init();

  let { isLoggedIn } = userStore;
  console.log(isLoggedIn, "LOGGED IN CHECK");
  if (to.meta?.requiresAuth) {
    let { isLoggedIn } = userStore;
    if (!isLoggedIn && token) {
      let { loginUserByToken } = userStore;
      try {
        const { user, gettedContexts, gettedRecords } = await loginUserByToken(
          token,
        );
        userStore.setUser(user);
        contextsStore.setupContexts(gettedContexts);
        recordsStore.setupRecords(gettedRecords);
      } catch (error) {
        // TODO: change to error component
        console.error("Error fetching user data:", error);
      }
    }

    if (!isLoggedIn) {
      console.log("last not logged in check");
      return {
        name: "Home",
      };
    }
  }
});

export default router;
