<template>
  <h1 class="mb-2 text-3xl font-medium">Profile</h1>
  <p class="mb-4 text-xl">Hi, {{ name }}</p>
  <v-form
    class="inline-flex flex-col space-y-2"
    @submit.prevent="changeFirstnameAndLastname"
  >
    <v-row>
      <v-col>
        <v-text-field
          v-model="firstname"
          name="firstname"
          id="firstname"
          :disabled="loading"
          label="Change your firstname"
          placeholder="Choose a new firstname"
        />
      </v-col>
      <v-col>
        <v-text-field
          :disabled="loading"
          required
          v-model="lastname"
          class="inline-block"
          name="lastname"
          id="lastname"
          label="Change your lastname"
          placeholder="Choose a new lastname"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col align="end">
        <VBtnPrimary :disabled="loading" type="submit">Save</VBtnPrimary>
      </v-col>
    </v-row>
  </v-form>
  <v-form
    class="inline-flex flex-col space-y-2"
    @submit.prevent="changePassword"
  >
    <v-row>
      <v-col>
        <FieldPassword
          v-model="password"
          name="password"
          id="password"
          :disabled="loading"
          label="Change your password"
          placeholder="Choose a new password"
        />
      </v-col>
      <v-col cols="12" align="end">
        <VBtnPrimary :disabled="loading" type="submit"
          >Change Password</VBtnPrimary
        >
      </v-col>
    </v-row>
  </v-form>
  <v-form
    class="inline-flex flex-col space-y-2"
    @submit.prevent="changeNickname"
  >
    <v-row>
      <v-col>
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
      </v-col>
      <v-col cols="12" align="end">
        <VBtnPrimary :disabled="loading" type="submit"
          >Change Nickname</VBtnPrimary
        >
      </v-col>
    </v-row>
  </v-form>
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

/* Change Firstname & Lastname */
const lastname = ref(metadata?.lastname);
const firstname = ref(metadata?.firstname);
async function changeFirstnameAndLastname() {
  loading.value = true;
  const { error } = await supabase.auth.update({
    data: { firstname: firstname.value, lastname: lastname.value },
  });
  if (error) alert(error.message);
  else {
    alert("firstname & lastname successfully changed");
  }
  loading.value = false;
}
</script>
