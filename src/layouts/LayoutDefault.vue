<template>
  <v-app full-height>
    <v-layout full-height>
      <AppTopBar v-model="open" />
      <NavDrawer v-model="open" />

      <v-main class="text-slate-700 dark:text-slate-300">
        <v-container
          class="overflow-auto"
          style="max-height: calc(100vh - 56px - 56px)"
        >
          <RouterView />
        </v-container>
      </v-main>
    </v-layout>
    <AppFooter />
  </v-app>
</template>

<script lang="ts" setup>
import NavDrawer from "@/components/NavDrawer.vue";
import AppTopBar from "@/components/AppTopBar.vue";
import AppFooter from "@/components/AppFooter.vue";

const open = ref(true);
</script>
