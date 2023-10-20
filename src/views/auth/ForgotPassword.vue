<template>
  <div>
    <h2 class="mb- text-2xl font-bold">Lost your password?</h2>
    <p class="mb-4 text-sm text-slate-500">Let's sort that for you</p>
    <v-form class="flex w-full flex-col items-start" @submit.prevent="onSubmit">
      <v-text-field
        required
        :disabled="loading"
        label="Email"
        class="w-full"
        name="email"
        id="email"
        type="email"
        placeholder="Enter your email"
        v-model="email"
      />

      <v-btn
        :loading="loading"
        type="submit"
        variant="plain"
        class="bg-teal-700"
      >
        Reset
      </v-btn>
    </v-form>

    <v-row>
      <v-col>
        <v-btn to="/signup" color="secondary">Sign up</v-btn><br />
      </v-col>
      <v-col align="end">
        <VBtnPrimary to="/signin">Sign in</VBtnPrimary>
      </v-col>
    </v-row>
  </div>
</template>
<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";

const email = ref("");
const loading = ref(false);
async function onSubmit() {
  loading.value = true;
  const { supabase } = useAuthStore();
  const { data, error } = await supabase().auth.api.resetPasswordForEmail(
    email.value,
    {
      redirectTo: `${window.location.origin}/resetpassword`,
    },
  );
  if (data) {
    alert("please follow the link in your email");
  } else if (error) {
    alert(error.message);
  }
  loading.value = false;
}
</script>
