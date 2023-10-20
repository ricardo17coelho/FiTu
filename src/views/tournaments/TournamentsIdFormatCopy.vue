<template>
  <v-container>
    <h1>FORMAT</h1>
    <!--    {{ matchArray }}-->
    <!--    <div>-->
    <!--      {{ teams }}-->
    <!--    </div>-->
    <!--    <div v-if="tournamentData">-->
    <!--      {{ tournamentData }}-->
    <!--      Matches: {{ tournamentData.matches }}-->
    <!--    </div>-->
    <h5 class="text-h5">Format: Group phase only</h5>
    <v-expansion-panels>
      <v-expansion-panel
        v-for="(matchRounds, matchRoundsIdx) in tournamentData.matches"
        :key="`match-round-${matchRoundsIdx}`"
        :title="`Round: ${matchRoundsIdx + 1}`"
      >
        <template #text>
          <v-row>
            <v-col
              v-for="(match, matchIdx) in matchRounds"
              :key="`match-${matchIdx}`"
            >
              <v-card max-width="200">
                <v-card>{{ match[0].alias }}</v-card>
                vs
                <v-card>{{ match[1].alias }}</v-card>
              </v-card>
            </v-col>
          </v-row>
        </template>
      </v-expansion-panel>
    </v-expansion-panels>

    <h5 class="text-h5">Format: knockout phase only</h5>
    <v-btn @click="onGenerateKnockout">Generate Matches</v-btn>
    <v-btn @click="genMatchesOriginal(4)">Generate Matches Original</v-btn>
    <div
      v-for="(knockoutOnly, knockoutOnlyIdx) in knockoutsOnly"
      :key="`knockout-only-${knockoutOnlyIdx}`"
    >
      <div
        v-for="(knockoutOnlyRound, knockoutOnlyRoundIdx) in knockoutOnly"
        :key="`knockout-only-round.${knockoutOnlyRoundIdx}`"
      >
        <div v-if="knockoutOnlyRound.length > 0">
          {{ knockoutOnlyRound[0].alias }}
        </div>
        <div v-if="knockoutOnlyRound.length > 1">
          {{ knockoutOnlyRound[1].alias }}
        </div>
      </div>
    </div>
    <h5 class="text-h5">Format: Group phase and knockout phase</h5>
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

const tournamentData = computed(() => {
  if (teams.value.length > 1) {
    console.warn(
      "teams",
      teams.value.map((t) => t.alias),
    );
    // const tournament = new Tournament(teams.value.map((t) => t.alias));
    const tournament = new Tournament(teams.value);
    console.warn("tournament", tournament);
    return tournament;
  }
  return [];
});

// generate round-robin

const roundRobin = (teams) => {
  let schedule = [];
  let league = teams.slice();

  if (league.length % 2) {
    league.push("None");
  }

  let rounds = league.length;

  for (let j = 0; j < (rounds - 1) * 2; j++) {
    schedule[j] = [];
    for (let i = 0; i < rounds / 2; i++) {
      if (league[i] !== "None" && league[rounds - 1 - i] !== "None") {
        if (j % 2 == 1) {
          schedule[j].push([league[i], league[rounds - 1 - i]]);
        } else {
          schedule[j].push([league[rounds - 1 - i], league[i]]);
        }
      }
    }
    league.splice(1, 0, league.pop());
  }
  return schedule;
};

onMounted(() => {
  let leagueSchedule = roundRobin(teams.value);

  for (let p = 0; p < leagueSchedule.length; p++) {
    console.log(leagueSchedule[p]);
  }
});

// generate array for knockout tournament
// const knockoutsOnly = ref<[][]>([]);
const knockoutsOnly = ref(undefined);

function onGenerateKnockout() {
  knockoutsOnly.value = genMatches(teams.value);
}
// function genMatchesOriginal(nrTeams) {
//   console.warn("genMatches", nrTeams);
//   while (nrTeams > 1) {
//     nrTeams = (nrTeams + 1) >> 1;
//     var matches = [];
//     for (var i = 0; i < nrTeams; ++i) {
//       matches.push([]);
//     }
//     knockoutsOnly.value.push(matches);
//   }
//   console.warn("knockoutsOnly", knockoutsOnly.value);
//   return knockoutsOnly;
// }
function genMatches(teams) {
  let teamsCount = teams.length;
  console.warn("genMatches", teamsCount);
  let totalMatches = teamsCount - 1;
  let byeCount = 0;
  let matchStructure = [];
  let log2 = Math.log2(teamsCount);
  let floorValue = Math.floor(log2);
  if (log2 > floorValue) {
    let tempPowerHolder = Math.pow(2, floorValue + 1);
    console.warn("tempPowerHolder", tempPowerHolder);
    let matches = [];
    byeCount = tempPowerHolder - teamsCount;
    teamsCount = tempPowerHolder / 2;
    for (let i = 0; i < teamsCount; ++i) {
      // const currentTeam = teams[i];
      matches.push([]);
    }
    matchStructure.push(matches);
  }

  while (teamsCount > 1) {
    teamsCount = (teamsCount + 1) >> 1;
    let matches = [];
    for (let i = 0; i < teamsCount; ++i) {
      matches.push([]);
    }
    matchStructure.push(matches);
  }
  console.warn("byeCount", byeCount);
  console.warn("totalMatches", totalMatches);
  console.warn("matchStructure", matchStructure);
  return {
    byeCount,
    totalMatches,
    matchStructure,
  };
}

const knockoutsOnly2 = ref<[][]>([]);
function genMatches2(teams) {
  console.warn("genMatches", teams);
  let teamsCount = teams.length;
  console.warn("teamsCount", teamsCount);
  while (teamsCount > 1) {
    console.warn("while:teamsCount", teamsCount);
    console.warn("while:2:teamsCount", teamsCount);
    let matches = [];
    for (let i = 0; i < teamsCount; ++i) {
      const currentTeam = teams[i];
      matches.push([currentTeam]);
    }
    teamsCount = (teamsCount + 1) >> 1;
    knockoutsOnly2.value.push(matches);
  }

  console.warn("knockoutsOnly2", knockoutsOnly2.value);
}
</script>
