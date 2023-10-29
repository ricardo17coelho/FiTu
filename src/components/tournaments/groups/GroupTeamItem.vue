<template>
  <v-list-item>
    <template #prepend v-if="icon">
      <v-icon>{{ icon }}</v-icon>
    </template>
    <template #title v-if="title"> {{ title }} </template>
    <template #append v-if="append">
      <v-badge :color="appendColor" :content="append" :inline="true"></v-badge>
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
const props = defineProps({
  icon: {
    type: String,
    default: "mdi-tshirt-crew",
  },
  title: {
    type: String,
    default: undefined,
  },
  append: {
    type: String,
    default: undefined,
  },
  appendColor: {
    type: String,
    default: undefined,
  },
});

watch(
  () => props.title,
  (newValue) => {
    console.warn("props.title", newValue);
  },
  { immediate: true },
);
</script>

<style scoped></style>
