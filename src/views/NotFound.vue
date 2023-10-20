<template>
  <div class="self-center text-xl font-medium mb-4">404 - Page not found</div>
  <VBtnPrimary :to="reRoute.to" class="self-center">
    {{ reRoute.text }}
  </VBtnPrimary>
</template>
<script lang="ts" setup>
import { supabase } from "@/services/supabase";

const reRoute = computed(() => {
  if (supabase().auth.getUser())
    return {
      to: "/",
      text: "Go Home",
    };
  return {
    to: "/signin",
    text: "Sign In",
  };
});
</script>
