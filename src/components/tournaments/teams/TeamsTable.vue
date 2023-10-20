<template>
  <AppTable title="Teams" :items="teams" :headers="headers">
    <!-- eslint-disable vue/valid-v-slot -->
    <template #item.tournament_team_players="{ item }">
      <v-dialog max-width="500px">
        <template #activator="{ props: ActivatorProps }">
          <VBtnPrimary
            v-bind="ActivatorProps"
            icon="mdi-account-plus"
            size="small"
          >
          </VBtnPrimary>
          ({{ item.tournament_team_players.length }})
        </template>
        <v-card>
          <v-card-title>
            <span class="text-h5">Players</span>
          </v-card-title>

          <v-card-text>
            <TeamPlayersTable :tournament-team-id="item.id" />
          </v-card-text>
        </v-card>
      </v-dialog>
    </template>
  </AppTable>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { supabase } from "@/services/supabase";
import AppTable from "@/components/AppTable.vue";
import TeamPlayersTable from "@/components/tournaments/teams/TeamPlayersTable.vue";

const props = defineProps({
  tournamentId: {
    type: String,
    default: null,
  },
});

const teams = ref([]);

const headers = ref([
  { title: "Name", key: "alias" },
  { title: "Logo", key: "logoUrl" },
  { title: "Players", key: "tournament_team_players" },
]);
async function getData() {
  const { data, error } = await supabase()
    .from("tournament_teams")
    .select(
      `
        id,
        alias,
        tournament_team_players ( id, name )
      `,
    )
    .eq("tournamentId", props.tournamentId);
  if (error) {
    console.error("Error on get teams");
    return;
  }
  teams.value = data;
}

onMounted(async () => {
  await getData();
});
</script>
