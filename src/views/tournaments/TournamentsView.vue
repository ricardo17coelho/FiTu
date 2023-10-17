<template>
  <v-row>
    <v-col>
      <v-dialog v-model="dialogAdd" max-width="500px">
        <template #activator="{ props: ActivatorProps }">
          <VBtnPrimary v-bind="ActivatorProps"> Add Tournament </VBtnPrimary>
        </template>
        <v-card>
          <v-card-title>
            <span class="text-h5">Add Tournament</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="tournament.name"
                    label="Tournament name"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="blue-darken-1"
              variant="text"
              @click="onSaveTournament"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
  <v-row>
    <v-col v-for="tournament in tournaments" :key="tournament.id">
      <v-card :title="tournament.name" @click="onItemClick(tournament)">
        <template #item>
          {{ tournament }}
        </template>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { supabase } from "@/services/supabase";
import router from "@/router";

const tournaments = ref([]);

async function getTournaments() {
  let { data, error } = await supabase.from("tournaments").select("*");
  console.warn("getTournaments", data);
  if (error) {
    console.error("Error on get tournaments");
    return;
  }
  tournaments.value = data;
}

onMounted(async () => {
  await getTournaments();
});

const dialogAdd = ref(false);
const tournament = ref({
  name: ref(""),
});

async function onSaveTournament() {
  const { data, error } = await supabase
    .from("tournaments")
    .insert([tournament.value])
    .select();

  if (error) {
    console.error("Error on add tournament");
    return;
  }
  console.info("Saved!", data);
}

function onItemClick(item) {
  console.warn("item", item);
  router.push({ name: "tournaments-id", params: { id: item.id } });
}
</script>
