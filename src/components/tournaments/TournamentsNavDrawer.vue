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
import CoreNavDrawer from "@/components/core/CoreNavDrawer.vue";
import { NavLinkItem } from "@/components/NavDrawer.vue";

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const route = useRoute();
const currentTournamentId = computed(() => route.params.id);

/* main navigation links for side drawer */
const navLinks = computed((): NavLinkItem[] => [
  {
    text: "Home",
    to: "/",
    icon: "mdi-home",
    show: () => true,
  },
  {
    text: "General",
    to: {
      name: "tournaments-id-general",
      params: { id: currentTournamentId.value },
    },
    icon: "mdi-cog",
    show: () => true,
  },
  {
    text: "Participants",
    to: {
      name: "tournaments-id-participants",
      params: { id: currentTournamentId.value },
    },
    icon: "mdi-account",
    show: () => true,
  },
  {
    text: "Format",
    to: {
      name: "tournaments-id-format",
      params: { id: currentTournamentId.value },
    },
    icon: "mdi-account",
    show: () => true,
  },
  {
    text: "Schedule",
    to: {
      name: "tournaments-id-schedule",
      params: { id: currentTournamentId.value },
    },
    icon: "mdi-account",
    show: () => true,
  },
  {
    text: "Results",
    to: {
      name: "tournaments-id-results",
      params: { id: currentTournamentId.value },
    },
    icon: "mdi-account",
    show: () => true,
  },
]);
</script>
