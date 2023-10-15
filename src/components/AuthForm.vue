<template>
  <div>
    <h2 class="mb- text-2xl font-bold">
      {{ title }}
    </h2>
    <p class="mb-4 text-sm text-slate-500">
      {{ subtitle }}
    </p>
    <v-form
      class="flex w-full flex-col items-start"
      @submit.prevent="emailAuth"
    >
      <v-text-field
        v-model="credentials.email"
        required
        :disabled="loading"
        label="Email"
        name="email"
        id="email"
        type="email"
        :placeholder="emailPlaceholder"
      />
      <FieldPassword
        v-model="credentials.password"
        :disabled="loading"
        class="mb-4 w-full"
        name="password"
        id="password"
        label="Password"
        :placeholder="passwordPlaceholder"
      />

      <v-row>
        <v-col>
          <v-btn v-if="!signUp" to="/forgotpassword" variant="text">
            Forgot your password?
          </v-btn>
        </v-col>
        <v-col align="end">
          <VBtnPrimary
            :loading="emailLoading"
            :disabled="loading"
            type="submit"
          >
            {{ signUp ? "Sign Up" : "Sign In" }}
          </VBtnPrimary>
        </v-col>
      </v-row>
    </v-form>
    <v-row>
      <v-col>
        <v-btn
          :loading="gitHubLoading"
          :disabled="loading"
          color="black"
          @click="gitHubAuth"
        >
          <v-icon>mdi-github</v-icon>
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
          :loading="googleLoading"
          :disabled="loading"
          color="#EA4335"
          @click="googleAuth"
        >
          <v-icon>mdi-google</v-icon>
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
          :loading="twitterLoading"
          :disabled="loading"
          color="#1DA1F2"
          @click="twitterAuth"
        >
          <v-icon>mdi-twitter</v-icon>
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
          :loading="facebookLoading"
          :disabled="loading"
          color="#425F9C"
          @click="facebookAuth"
        >
          <v-icon>mdi-facebook</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <slot name="actions" />
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import { Ref } from "vue";
import { UserCredentials } from "@supabase/supabase-js";
import FieldPassword from "@/components/fields/FieldPassword.vue";

const props = defineProps<{
  signUp: boolean;
  title: string;
  subtitle: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
}>();

const credentials: Ref<UserCredentials> = ref({
  email: "",
  password: "",
});

const router = useRouter();

const emailLoading = ref(false);
async function emailAuth() {
  emailLoading.value = true;
  const { supabase } = useAuthStore();
  const { user, error } = props.signUp
    ? await supabase.auth.signUp(credentials.value)
    : await supabase.auth.signIn(credentials.value);
  if (user) router.push("/");
  else if (error) {
    alert(error.message);
    emailLoading.value = false;
  }
}

const gitHubLoading = ref(false);
async function gitHubAuth() {
  gitHubLoading.value = true;
  const { supabase } = useAuthStore();
  const { user, error } = await supabase.auth.signIn(
    { provider: "github" },
    {
      redirectTo: `${window.location.origin}/callback`,
    }
  );
  if (user) router.push("/");
  else if (error) {
    alert(error.message);
    gitHubLoading.value = false;
  }
}

const googleLoading = ref(false);
async function googleAuth() {
  googleLoading.value = true;
  const { supabase } = useAuthStore();
  const { user, error } = await supabase.auth.signIn(
    { provider: "google" },
    {
      redirectTo: `${window.location.origin}/callback`,
    }
  );
  if (user) router.push("/");
  else if (error) {
    alert(error.message);
    googleLoading.value = false;
  }
}

const twitterLoading = ref(false);
async function twitterAuth() {
  twitterLoading.value = true;
  const { supabase } = useAuthStore();
  const { user, error } = await supabase.auth.signIn(
    { provider: "twitter" },
    {
      redirectTo: `${window.location.origin}/callback`,
    }
  );
  if (user) router.push("/");
  else if (error) {
    alert(error.message);
    twitterLoading.value = false;
  }
}

const facebookLoading = ref(false);
async function facebookAuth() {
  facebookLoading.value = true;
  const { supabase } = useAuthStore();
  const { user, error } = await supabase.auth.signIn(
    { provider: "facebook" },
    {
      redirectTo: `${window.location.origin}/callback`,
    }
  );
  if (user) router.push("/");
  else if (error) {
    alert(error.message);
    facebookLoading.value = false;
  }
}

const loading = computed(
  () =>
    gitHubLoading.value ||
    emailLoading.value ||
    googleLoading.value ||
    twitterLoading.value ||
    facebookLoading.value
);
</script>
