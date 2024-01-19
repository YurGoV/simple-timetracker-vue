// Composables
import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/store/user";
import { useContextsStore } from "@/store/contexts";
import { useRecordsStore } from "@/store/records";
import { loginUserByToken } from "@/services/auth.service";

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
      // {
      //   path: "/time/:action?/edit/:id?",
      //   name: "Time",
      //   component: () => import("@/views/TimeView.vue"),
      //   meta: { requiresAuth: true },
      // },
      // {
      //   path: "/time",
      //   name: "Time",
      //   component: () => import("@/views/TimeView.vue"),
      //   meta: { requiresAuth: true },
      //   children: [
      //     {
      //       path: "add",
      //       name: "AddTime",
      //       component: () => import("@/components/AddTime.vue"),
      //     },
      //     {
      //       path: "review",
      //       name: "ReviewTime",
      //       component: () => import("@/components/ReviewTime.vue"),
      //     },
      //     {
      //       path: "edit",
      //       name: "EditTime",
      //       component: () => import("@/components/EditTime.vue"),
      //     },
      //   ],
      // },
    ],
  },
];

const base = import.meta.env.BASE_URL;

const router = createRouter({
  history: createWebHistory(base),
  routes,
});

router.beforeResolve(async (to, from, next) => {
  // console.log("beforeResolve router");
  // Your logic here
  next();
});

router.beforeEach(async (to, from, next) => {
  // console.log("befor each router");
  const userStore = useUserStore();
  // TODO: refactoring to all inside login/current in user store
  const contextsStore = useContextsStore();
  const recordsStore = useRecordsStore();
  const token = localStorage.getItem("token");
  // await userStore.init();

  const { isLoggedIn } = userStore;
  // console.log(isLoggedIn, "LOGGED IN CHECK");
  if (!isLoggedIn && token) {
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
      return next(false);
      // next(false);
    }

    // if (to.meta?.requiresAuth) {
    //   // let { isLoggedIn } = userStore;
    //   if (!isLoggedIn) {
    //     console.log("last not logged in check");
    //     return {
    //       name: "Home",
    //     };
    //   }
    // }
  }
  if (to.meta?.requiresAuth && !userStore.isLoggedIn) {
    // console.log("User not logged in, redirecting to Home");
    return next({
      name: "Home",
    });
  }
  // } else {
  //   // Continue with the navigation
  next();
});

export default router;
