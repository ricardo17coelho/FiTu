<template>
  <v-container>
    <h1>FORMAT</h1>
    <JsonTreeView
      :data="JSON.stringify({ doubleRound, singleRound, simpleCup })"
    />

    <h5 class="text-h5">Format: Group phase only</h5>
    <!--    <v-expansion-panels>-->
    <!--      <v-expansion-panel-->
    <!--        v-for="(matchRounds, matchRoundsIdx) in tournamentData.matches"-->
    <!--        :key="`match-round-${matchRoundsIdx}`"-->
    <!--        :title="`Round: ${matchRoundsIdx + 1}`"-->
    <!--      >-->
    <!--        <template #text>-->
    <!--          <v-row>-->
    <!--            <v-col-->
    <!--              v-for="(match, matchIdx) in matchRounds"-->
    <!--              :key="`match-${matchIdx}`"-->
    <!--            >-->
    <!--              <v-card max-width="200">-->
    <!--                <v-card>{{ match[0].alias }}</v-card>-->
    <!--                vs-->
    <!--                <v-card>{{ match[1].alias }}</v-card>-->
    <!--              </v-card>-->
    <!--            </v-col>-->
    <!--          </v-row>-->
    <!--        </template>-->
    <!--      </v-expansion-panel>-->
    <!--    </v-expansion-panels>-->

    <h5 class="text-h5">Format: knockout phase only</h5>

    <!--    <div-->
    <!--      v-for="(knockoutOnly, knockoutOnlyIdx) in knockoutsOnly"-->
    <!--      :key="`knockout-only-${knockoutOnlyIdx}`"-->
    <!--    >-->
    <!--      <div-->
    <!--        v-for="(knockoutOnlyRound, knockoutOnlyRoundIdx) in knockoutOnly"-->
    <!--        :key="`knockout-only-round.${knockoutOnlyRoundIdx}`"-->
    <!--      >-->
    <!--        <div v-if="knockoutOnlyRound.length > 0">-->
    <!--          {{ knockoutOnlyRound[0].alias }}-->
    <!--        </div>-->
    <!--        <div v-if="knockoutOnlyRound.length > 1">-->
    <!--          {{ knockoutOnlyRound[1].alias }}-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
    <h5 class="text-h5">Format: Group phase and knockout phase</h5>
  </v-container>
</template>

<script setup lang="ts">
import { supabase } from "@/services/supabase";
import { computed, onMounted } from "vue";
import generator from "@/utils/tournament-generator";
import { JsonTreeView } from "json-tree-view-vue3";

const props = defineProps({
  id: {
    type: String,
    default: null,
  },
});

const teams = ref([]);
async function getData() {
  const { data, error } = await supabase()
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

// Generate and get games

const doubleRound = computed(() => {
  return generator(teams.value, { type: "double-round" });
});

const singleRound = computed(() => {
  return generator(teams.value, { type: "single-round" });
});

const simpleCup = computed(() => {
  return generator(teams.value, { type: "simple-cup" });
});
</script>
