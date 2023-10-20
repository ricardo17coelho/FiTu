import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "./stores/auth";
import { supabase } from "@/services/supabase";

// Layouts
import LayoutDefault from "@/layouts/LayoutDefault.vue";
import LayoutAuth from "@/layouts/LayoutAuth.vue";
import LayoutTournament from "@/layouts/LayoutTournament.vue";
// import LayoutEmpty from "@/layouts/LayoutEmpty.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/signin",
      component: LayoutAuth,
      meta: {
        requiresNoAuth: true,
      },
      children: [
        {
          path: "/signin",
          name: "signIn",
          component: () => import("@/views/auth/SignIn.vue"),
        },
        {
          path: "/signup",
          name: "signUp",
          component: () => import("@/views/auth/SignUp.vue"),
        },
        {
          path: "/forgotpassword",
          name: "forgotPassword",
          component: () => import("@/views/auth/ForgotPassword.vue"),
        },
      ],
    },
    {
      path: "/resetpassword",
      component: LayoutAuth,
      children: [
        {
          path: "/resetpassword",
          name: "resetPassword",
          component: () => import("@/views/auth/ResetPassword.vue"),
          beforeEnter: (to) => {
            // only allow navigation to reset password
            // if we actually clicked a proper reset password link
            // which provides the type=recovery hash key
            if (!to.hash.includes("type=recovery")) {
              if (supabase().auth.getUser()) return "/";
              return "/signin";
            }
          },
        },
        {
          path: "/callback",
          name: "callback",
          component: () => import("@/views/auth/AuthCallback.vue"),
          beforeEnter: (to) => {
            /* Parse the route hash into a dictionary */
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            const hashDictionary = {} as any;
            // first remove the actual '#' character
            const hash = to.hash.replace("#", "");
            // split hash into key-value pairs
            hash.split("&").forEach((item) => {
              // split 'key=value' into [key, value]
              const [key, value] = item.split("=");
              // add to results
              hashDictionary[key] = value;
            });

            if (
              [
                "access_token",
                "expires_in",
                "provider_token",
                "refresh_token",
                "token_type",
              ].some((key) => !(key in hashDictionary))
            )
              return "/";
          },
        },
        {
          path: "/:pathMatch(.*)*",
          name: "NotFound",
          component: () => import("@/views/NotFound.vue"),
        },
      ],
    },

    {
      path: "/",
      component: LayoutDefault,
      meta: {
        requiresAuth: true,
        showOnDrawer: true,
      },
      children: [
        {
          path: "/",
          name: "home",
          component: () => import("@/views/HomeView.vue"),
          meta: {
            showOnDrawer: true,
          },
        },
        {
          path: "/profile",
          name: "profile",
          component: () => import("@/views/ProfileView.vue"),
          meta: {
            showOnDrawer: true,
          },
        },
        {
          path: "/tournaments",
          name: "tournaments-list",
          component: () => import("@/views/tournaments/TournamentsView.vue"),
          meta: {
            showOnDrawer: true,
          },
        },
        {
          path: "/test",
          name: "test",
          component: () => import("@/views/TestView.vue"),
          meta: {
            showOnDrawer: true,
          },
        },
      ],
    },
    {
      path: "/admin",
      name: "admin",
      redirect: { name: "admin-users" },
      component: LayoutDefault,
      meta: {
        showOnDrawer: true,
      },
      children: [
        {
          path: "/admin/users",
          name: "admin-users",
          component: () => import("@/views/admin/AdminUsers.vue"),
          meta: {
            can: "is-super-admin",
            showOnDrawer: true,
          },
        },
        {
          path: "/admin/nations",
          name: "admin-nations",
          component: () => import("@/views/admin/AdminNations.vue"),
          meta: {
            can: "is-super-admin",
            showOnDrawer: true,
          },
        },
        {
          path: "/admin/leagues",
          name: "admin-leagues",
          component: () => import("@/views/admin/AdminLeagues.vue"),
          meta: {
            can: "is-super-admin",
            showOnDrawer: true,
          },
        },
        {
          path: "/admin/clubs",
          name: "admin-clubs",
          component: () => import("@/views/admin/AdminClubs.vue"),
          meta: {
            can: "is-super-admin",
            showOnDrawer: true,
          },
        },
      ],
    },
    {
      path: "/tournaments/:id",
      component: LayoutTournament,
      meta: {
        showOnDrawer: true,
      },
      children: [
        {
          path: "",
          name: "tournaments-id",
          component: () => import("@/views/tournaments/TournamentsId.vue"),
          meta: {
            showOnDrawer: true,
          },
          props: true,
        },
        {
          path: "/tournaments/:id/general",
          name: "tournaments-id-general",
          component: () =>
            import("@/views/tournaments/TournamentsIdGeneral.vue"),
          meta: {
            showOnDrawer: true,
          },
          props: true,
        },
        {
          path: "/tournaments/:id/participants",
          name: "tournaments-id-participants",
          component: () =>
            import("@/views/tournaments/TournamentsIdParticipants.vue"),
          meta: {
            showOnDrawer: true,
          },
          props: true,
        },
        {
          path: "/tournaments/:id/format",
          name: "tournaments-id-format",
          component: () =>
            import("@/views/tournaments/TournamentsIdFormat.vue"),
          meta: {
            showOnDrawer: true,
          },
          props: true,
        },
        {
          path: "/tournaments/:id/schedule",
          name: "tournaments-id-schedule",
          component: () =>
            import("@/views/tournaments/TournamentsIdSchedule.vue"),
          meta: {
            showOnDrawer: true,
          },
          props: true,
        },
        {
          path: "/tournaments/:id/presentation",
          name: "tournaments-id-presentation",
          component: () =>
            import("@/views/tournaments/TournamentsIdPresentation.vue"),
          meta: {
            showOnDrawer: true,
          },
          props: true,
        },
        {
          path: "/tournaments/:id/results",
          name: "tournaments-id-results",
          component: () =>
            import("@/views/tournaments/TournamentsIdResults.vue"),
          meta: {
            showOnDrawer: true,
          },
          props: true,
        },
      ],
    },
  ],
});

supabase().auth.onAuthStateChange((event) => {
  console.log(event);
  if (event == "SIGNED_OUT") return router.push("/signin");
  if (event == "SIGNED_IN") {
    const routeName = router.currentRoute.value.name;
    console.log("routeName", routeName);

    if (routeName == "callback") {
      setTimeout(() => {
        return router.push({ name: "home" });
      }, 0);
    }
  }
});

router.beforeEach(async (to) => {
  const { currentUser, setCurrentUser } = useAuthStore();

  const {
    data: { session },
  } = await supabase().auth.getSession();

  if (!currentUser) {
    const currentUser = await supabase().auth.getUser();
    setCurrentUser(currentUser);
  }

  if (to.meta.requiresAuth && !session) {
    return {
      path: "/signin",
    };
  }
  if (to.meta.requiresNoAuth && session) {
    return {
      path: "/",
    };
  }
});

export default router;
