<template>
  <h1 class="mb-2 text-3xl font-medium">Profile</h1>
  <p class="mb-4 text-xl">Hi, {{ name }}</p>
  <v-row>
    <v-col>
      <v-form
        class="inline-flex flex-col space-y-2"
        @submit.prevent="changePassword"
      >
        <FieldPassword
          v-model="password"
          name="password"
          id="password"
          :disabled="loading"
          label="Change your password"
          placeholder="Choose a new password"
        />
        <VBtnPrimary :disabled="loading">Change Password</VBtnPrimary>
      </v-form>
    </v-col>
    <v-col>
      <v-form
        class="inline-flex flex-col space-y-2"
        @submit.prevent="changeNickname"
      >
        <v-text-field
          :disabled="loading"
          required
          v-model="nickname"
          class="inline-block"
          name="nickname"
          id="nickname"
          label="Change your nickname"
          placeholder="Choose a new nickname"
        />
        <VBtnPrimary :disabled="loading">Change Nickname</VBtnPrimary>
      </v-form>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { supabase } from "@/services/supabase";
import { User } from "@supabase/supabase-js";
import FieldPassword from "@/components/fields/FieldPassword.vue";

const user = supabase.auth.user() as User;
const metadata = user.user_metadata;
const name = ref(metadata?.nickname || user.email);

const password = ref("");
const nickname = ref(name.value);

const loading = ref(false);

/* Change Password */
async function changePassword() {
  loading.value = true;
  const { error } = await supabase.auth.update({
    password: password.value,
  });
  alert(error?.message || "password successfully changed");
  password.value = "";
  loading.value = false;
}

/* Change Nickname */
async function changeNickname() {
  loading.value = true;
  const { error } = await supabase.auth.update({
    data: { nickname: nickname.value },
  });
  if (error) alert(error.message);
  else {
    alert("nickname successfully changed");
    name.value = nickname.value;
  }
  loading.value = false;
}
</script>
