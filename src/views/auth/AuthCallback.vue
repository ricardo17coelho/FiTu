<template>
  <LoadingIcon class="mx-auto w-16" />
</template>
<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import LoadingIcon from "@/components/LoadingIcon.vue";

const router = useRouter();
const { supabase } = useAuthStore();

onMounted(() => {
  if (supabase().auth.getUser()) {
    console.log(
      "arrived on callback page with an existing user, so going home",
    );
    setTimeout(() => {
      router.push("/");
    }, 0);
  }
});
</script>
