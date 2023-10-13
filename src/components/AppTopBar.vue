<template>
  <!-- <header
    class="sticky top-0 z-30 flex items-center justify-between p-3 shadow"
  >
    <div class="flex items-center">
      <v-icon-button @click="$emit('update:modelValue', !modelValue)">
        <i-carbon-menu class="h-6 w-6" />
      </v-icon-button>
    </div>
    <div class="flex items-center space-x-4">
      <v-icon-button @click="toggleDark()">
        <i-carbon-sun class="h-6 w-6 dark:hidden" />
        <i-carbon-moon class="hidden h-6 w-6 dark:block" />
      </v-icon-button>
    </div>
  </header> -->

  <v-app-bar color="primary" density="comfortable">
    <template v-slot:prepend>
      <v-app-bar-nav-icon
        @click="emit('update:modelValue', !modelValue)"
      ></v-app-bar-nav-icon>
    </template>

    <v-app-bar-title>FiTu</v-app-bar-title>

    <template v-slot:append>
      <v-btn icon="mdi-theme-light-dark" @click="toggleTheme" />
      <v-btn icon="mdi-dots-vertical"></v-btn>
      <v-btn icon="mdi-logout" @click="signOut" />
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { supabase } from "@/services/supabase";
import { useTheme } from "vuetify";

/* modelValue here refers to whether or not to show side nav drawer */
defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

/** Vuetify Theme */
const theme = useTheme();

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
}

async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) alert(error.message);
}
</script>
