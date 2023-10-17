<template>
  <v-data-table
    v-bind="$attrs"
    :headers="computedHeaders"
    :items="items"
    :sort-by="[{ key: 'id', order: 'asc' }]"
    class="elevation-1"
    @click:row="onClickRow"
  >
    <template #top>
      <v-toolbar :flat="true">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-divider class="mx-4" :inset="true" :vertical="true" />
        <v-spacer />
        <v-btn color="primary" dark class="mb-2" @click="emit('click:add')">
          New Item
        </v-btn>
        <template v-if="$slots['toolbar-extension']" #extension>
          <slot name="toolbar-extension" />
        </template>
      </v-toolbar>
    </template>
    <!-- this allow to overwrite all slots -->
    <template v-for="(_, name) in $slots" v-slot:[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
    <!-- eslint-disable vue/valid-v-slot -->
    <template #item.logoUrl="{ item }">
      <v-avatar v-if="item.logoUrl" color="grey-lighten-4" class="border-solid">
        <v-img
          :cover="true"
          :src="item.logoUrl"
          :alt="`logo-url-${item.name}`"
        ></v-img>
      </v-avatar>
    </template>
    <!-- eslint-disable vue/valid-v-slot -->
    <template #item.actions="{ item }">
      <v-icon size="small" class="me-2" @click="emit('click:edit:item', item)">
        mdi-pencil
      </v-icon>
      <v-icon size="small" @click="emit('click:delete:item', item)">
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: undefined,
  },
  items: {
    type: Array,
    default: () => [],
  },
  headers: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits([
  "click:add",
  "click:delete:item",
  "click:edit:item",
  "click:row",
]);

const computedHeaders = computed(() => {
  return [
    ...props.headers,
    { title: "Actions", key: "actions", sortable: false },
  ];
});

function onClickRow(e, params) {
  emit("click:row", e, params);
}
</script>

<style scoped></style>
