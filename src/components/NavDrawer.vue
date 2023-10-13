<template>
  <v-navigation-drawer
    v-bind="$attrs"
    :model-value="modelValue"
    @update:modelValue="emit('update:modelValue', !modelValue)"
  >
    <v-list>
      <template v-for="navLink in navLinks" :key="navLink.text">
        <v-list-group v-if="navLink.children" :value="navLink.text">
          <template #activator="{ props: NavLinkProps }">
            <v-list-item
              v-bind="NavLinkProps"
              :prepend-icon="navLink.icon"
              :title="navLink.text"
            ></v-list-item>
          </template>
          <v-list-item-title
            v-for="navLinkChildren in navLink.children"
            :key="navLinkChildren.text"
            :value="navLinkChildren.text"
          >
            <v-list-item
              :title="navLinkChildren.text"
              :prepend-icon="navLinkChildren.icon"
              :to="navLinkChildren.to"
              :link="true"
              :exact="true"
            >
            </v-list-item>
          </v-list-item-title>
        </v-list-group>

        <v-list-item
          v-else
          :title="navLink.text"
          :prepend-icon="navLink.icon"
          :to="navLink.to"
          :link="true"
          :exact="true"
        ></v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { supabase } from "@/services/supabase";
import { computed } from "vue";
import { RouteLocationRaw } from "vue-router";

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

export interface NavLinkItem {
  text: string;
  to?: RouteLocationRaw;
  icon: string;
  children?: NavLinkItem[];
}

/* main navigation links for side drawer */
const navLinks = computed((): NavLinkItem[] => [
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
  {
    text: "Admin",
    icon: "mdi-account",
    children: [
      {
        text: "Nations",
        to: "/admin/nations",
        icon: "mdi-account",
      },
      {
        text: "Leagues",
        to: "/admin/leagues",
        icon: "mdi-account",
      },
      {
        text: "Clubs",
        to: "/admin/clubs",
        icon: "mdi-account",
      },
    ],
  },
  {
    text: "Test",
    to: "/test",
    icon: "mdi-bug",
  },
]);

async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) alert(error.message);
}
</script>
