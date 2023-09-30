<template>
  <v-navigation-drawer
    v-bind="$attrs"
    :model-value="modelValue"
    @update:modelValue="emit('update:modelValue', !modelValue)"
  >
    <v-list-item
      v-for="navLink in navLinks"
      :key="navLink.text"
      link
      exact
      :title="navLink.text"
      :to="navLink.to"
      :prepend-icon="navLink.icon"
    ></v-list-item>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { supabase } from "@/services/supabase";

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

/* main navigation links for side drawer */
const navLinks = [
  {
    text: "Home",
    to: "/",
    icon: "mdi-home",
  },
  {
    text: "Profile",
    to: "/profile",
    icon: "mdi-account",
  },
];

async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) alert(error.message);
}
</script>
