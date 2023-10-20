<template>
  <AppTable
    title="Teams"
    :items="teams"
    :headers="headers"
    @click:add="dialogAdd = true"
  >
  </AppTable>
  <v-dialog v-model="dialogAdd" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="text-h5">Add Player</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="player.name"
                label="Player name"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="player.email"
                label="Player email"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="blue-darken-1" variant="text" @click="onSavePlayer">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { supabase } from "@/services/supabase";
import AppTable from "@/components/AppTable.vue";

const props = defineProps({
  tournamentTeamId: {
    type: String,
    default: null,
  },
});

const teams = ref([]);

const headers = ref([
  { title: "Name", key: "name" },
  { title: "Email", key: "email" },
]);
async function getData() {
  const { data, error } = await supabase()
    .from("tournament_team_players")
    .select("*")
    .eq("tournamentTeamId", props.tournamentTeamId);
  if (error) {
    console.error("Error on get teams");
    return;
  }
  teams.value = data;
}

onMounted(async () => {
  await getData();
});

const dialogAdd = ref(false);

const player = ref({
  name: ref(""),
  email: ref(""),
});

async function onSavePlayer(tournamentTeamId) {
  const { data, error } = await supabase()
    .from("tournament_team_players")
    .insert([{ ...player.value, tournamentTeamId }])
    .select();

  if (error) {
    console.error("Error on add tournament_team_players");
    return;
  }
  console.info("Saved!", data);
}
</script>
