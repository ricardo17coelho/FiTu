<template>
  <v-navigation-drawer
    v-bind="$attrs"
    :model-value="modelValue"
    @update:modelValue="emit('update:modelValue', !modelValue)"
  >
    <v-list>
      <template v-for="navLink in items" :key="navLink.text">
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

<script setup lang="ts">
import { RouteLocationRaw } from "vue-router";

export interface NavLinkItem {
  text: string;
  to?: RouteLocationRaw;
  icon: string;
  children?: NavLinkItem[];
  show?: () => boolean;
}

defineProps<{
  modelValue: boolean;
  items: NavLinkItem[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();
</script>
