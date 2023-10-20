<template>
  <CoreNavDrawer
    v-bind="$attrs"
    :model-value="modelValue"
    :items="navLinks.filter((item) => (item.show ? item.show() : false))"
    @update:modelValue="emit('update:modelValue', !modelValue)"
  >
  </CoreNavDrawer>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { RouteLocationRaw } from "vue-router";
import { useAcl } from "vue-simple-acl";
import { isDevEnv } from "@/utils";
import CoreNavDrawer from "@/components/core/CoreNavDrawer.vue";

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const acl = useAcl();

export interface NavLinkItem {
  text: string;
  to?: RouteLocationRaw;
  icon: string;
  children?: NavLinkItem[];
  show?: () => boolean;
}

/* main navigation links for side drawer */
const navLinks = computed((): NavLinkItem[] => [
  {
    text: "Home",
    to: "/",
    icon: "mdi-home",
    show: () => true,
  },
  {
    text: "Profile",
    to: "/profile",
    icon: "mdi-account",
    show: () => true,
  },
  {
    text: "Admin",
    icon: "mdi-account",
    show: () => acl.can("is-super-admin"),
    children: [
      {
        text: "Users",
        to: "/admin/users",
        icon: "mdi-account",
        show: () => acl.can("is-super-admin"),
      },
      {
        text: "Nations",
        to: "/admin/nations",
        icon: "mdi-account",
        show: () => acl.can("is-super-admin"),
      },
      {
        text: "Leagues",
        to: "/admin/leagues",
        icon: "mdi-account",
        show: () => acl.can("is-super-admin"),
      },
      {
        text: "Clubs",
        to: "/admin/clubs",
        icon: "mdi-account",
        show: () => acl.can("is-super-admin"),
      },
    ],
  },
  {
    text: "Tournaments",
    icon: "mdi-account",
    show: () => true,
    children: [
      {
        text: "My Tournaments",
        to: "/tournaments",
        icon: "mdi-account",
        show: () => true,
      },
    ],
  },
  {
    text: "Test",
    to: "/test",
    icon: "mdi-bug",
    show: () => isDevEnv(),
  },
]);

// async function signOut() {
//   const { error } = await supabase().auth.signOut();
//   if (error) alert(error.message);
// }
</script>
