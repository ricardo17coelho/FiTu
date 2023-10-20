<template>
  <div>
    <h2 class="mb- text-2xl font-bold">Reset Password</h2>
    <p class="mb-4 text-sm text-slate-500">Choose a new password below</p>
    <v-form class="flex w-full flex-col items-start" @submit.prevent="onSubmit">
      <FieldPassword
        :disabled="loading"
        class="mb-4 w-full"
        name="password"
        id="password"
        label="Password"
        placeholder="Choose your password"
        v-model="password"
      />

      <v-btn :loading="loading" type="submit" class="bg-teal-700">
        Reset
      </v-btn>
    </v-form>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import FieldPassword from "@/components/fields/FieldPassword.vue";
const router = useRouter();
const route = useRoute();

/* Parse the route hash into a dictionary so we can pick out the access_token provided */
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const hashDictionary = {} as any;
// first remove the actual '#' character
const hash = route.hash.replace("#", "");
// split hash into key-value pairs
hash.split("&").forEach((item) => {
  // split 'key=value' into [key, value]
  const [key, value] = item.split("=");
  // add to results
  hashDictionary[key] = value;
});
const resetToken = hashDictionary.access_token;

const password = ref("");
const loading = ref(false);
async function onSubmit() {
  const { supabase } = useAuthStore();
  loading.value = true;
  const { error, data } = await supabase().auth.api.updateUser(resetToken, {
    password: password.value,
  });
  console.log(error, data);

  if (error) {
    alert(error.message);
  } else {
    alert("successfully reset password.");
    router.push("/");
  }
  loading.value = false;
}
</script>
