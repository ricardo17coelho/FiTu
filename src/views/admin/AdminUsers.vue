<template>
  <AppTable
    title="Users"
    :items="users"
    :headers="headers"
    @click:edit:item="onClickEditItem"
    @click:delete:item="onClickDeleteItem"
  >
    <!-- eslint-disable vue/valid-v-slot -->
    <template #item.name="{ item }">
      <template v-if="item.user_metadata">
        <template
          v-if="item.user_metadata?.firstname || item.user_metadata?.lastname"
        >
          {{
            `${item.user_metadata?.firstname} ${item.user_metadata?.lastname}`
          }}
        </template>
        <template v-else>-</template>
      </template>
    </template>
    <!-- eslint-disable vue/valid-v-slot -->
    <template #item.email_confirmed_at="{ item }">
      <v-icon :color="!!item.email_confirmed_at ? 'success' : 'error'">
        {{ !!item.email_confirmed_at ? "mdi-check" : "mdi-close" }}
      </v-icon>
    </template>
  </AppTable>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { supabaseAdmin } from "@/services/supabase";
import AppTable from "@/components/AppTable.vue";
import { User } from "@supabase/supabase-js";

const users = ref<User[]>([]);

const headers = ref([
  { title: "Name", key: "name" },
  { title: "Email", key: "email" },
  { title: "Email confirmed", key: "email_confirmed_at" },
]);
async function getUsers() {
  const { data, error } = await supabaseAdmin().auth.admin.listUsers();
  if (error) {
    console.error("Error on get users");
    return;
  }
  users.value = data.users;
}

onMounted(async () => {
  await getUsers();
});

function onClickEditItem(item: User) {
  console.warn("onClickEditItem", item);
}

function onClickDeleteItem(item: User) {
  console.warn("onClickDeleteItem", item);
}
</script>
