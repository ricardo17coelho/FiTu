<template>
  <v-container>
    <h1>FORMAT</h1>
    <div>
      {{ teams }}
    </div>
    <div v-if="tournamentData">
      {{ tournamentData }}
      Matches: {{ tournamentData.matches }}
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { supabase } from "@/services/supabase";
import { computed, onMounted } from "vue";
import Tournament from "@/utils/tournament";

const props = defineProps({
  id: {
    type: String,
    default: null,
  },
});

const teams = ref([]);
async function getData() {
  const { data, error } = await supabase
    .from("tournament_teams")
    .select("*")
    .eq("tournamentId", props.id);
  if (error) {
    console.error("Error on get teams");
    return;
  }
  teams.value = data;
}

onMounted(async () => {
  await getData();
});

const tournamentData = computed(() => {
  if (teams.value.length > 1) {
    console.warn(
      "teams",
      teams.value.map((t) => t.alias)
    );
    // const tournament = new Tournament(teams.value.map((t) => t.alias));
    const tournament = new Tournament(teams.value);
    console.warn("tournament", tournament);
    return tournament;
  }
  return [];
});
</script>
