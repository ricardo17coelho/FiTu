<template>
  <v-card variant="flat">
    <v-tabs
      v-model="currentTab"
      color="deep-purple-accent-4"
      align-tabs="center"
    >
      <v-tab v-for="tab in tabs" :key="tab.id" :value="tab.id">
        {{ tab.name }}
      </v-tab>
    </v-tabs>
    <v-window v-model="currentTab">
      <v-window-item v-for="tab in tabs" :key="tab.id" :value="tab.id">
        <template v-if="tab.id === 'teams'">
          <TeamsTable :tournament-id="id" />
        </template>
        <template v-if="tab.id === 'administrators'">
          <AdministratorsTable :tournament-id="id" />
        </template>
        <v-container v-else :fluid="true">
          <v-row> </v-row>
        </v-container>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { supabase } from "@/services/supabase";
import TeamsTable from "@/components/tournaments/teams/TeamsTable.vue";
import AdministratorsTable from "@/components/tournaments/administrators/AdministratorsTable.vue";

const props = defineProps({
  id: {
    type: String,
    default: null,
  },
});

const tournament = ref(undefined);

async function getData() {
  let { data, error } = await supabase()
    .from("tournaments")
    .select("*")
    .eq("id", props.id);
  console.warn("getData", data);
  if (error) {
    console.error("Error on get tournaments");
    return;
  }
  tournament.value = data;
}

onMounted(async () => {
  await getData();
});

const currentTab = ref(null);

const tabs = computed(() => [
  {
    id: "teams",
    name: "Teams",
  },
  {
    id: "administrators",
    name: "Administrators",
  },
]);
</script>
