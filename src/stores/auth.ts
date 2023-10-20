import { supabase } from "@/services/supabase";
import type { User } from "@supabase/supabase-js";

import { ref } from "vue";
import { defineStore, acceptHMRUpdate } from "pinia";

export const useAuthStore = defineStore(
  "authStore",
  () => {
    const currentUser = ref<undefined | User>(undefined);

    function setCurrentUser(supabaseUser: User) {
      currentUser.value = supabaseUser;
    }

    return {
      // state
      supabase,
      currentUser,

      setCurrentUser,
    };
  },
  { persist: true },
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
