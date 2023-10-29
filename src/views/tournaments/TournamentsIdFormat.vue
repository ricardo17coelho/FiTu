<template>
  <v-container>
    <h1>FORMAT</h1>
    <JsonTreeView
      :data="
        JSON.stringify({
          doubleRound,
          singleRound,
          simpleCup,
          doubleRoundGroupedByRound,
        })
      "
    />

    <h5 class="text-h5">Format: Group phase only</h5>
    <v-card>
      <v-card-title>
        Group
        <!-- TODO: button to edit, delete -->
      </v-card-title>

      <v-card-item>
        <v-expansion-panels>
          <v-expansion-panel
            v-for="(
              doubleRoundItem, doubleRoundItemIdx
            ) in doubleRoundGroupedByRound"
            :key="`double-round-item-${doubleRoundItemIdx}`"
            :title="`Round: ${doubleRoundItemIdx + 1}`"
          >
            <template #text>
              <v-row>
                <v-col
                  v-for="(
                    doubleRoundItemGroup, doubleRoundItemGroupIdx
                  ) in doubleRoundItem[1]"
                  :key="`match-${doubleRoundItemGroupIdx}`"
                >
                  <v-card class="red">
                    <v-card-title class="text-body-1">
                      GROUP NAME
                    </v-card-title>
                    <v-card-item>
                      <GroupTeamItem
                        :title="doubleRoundItemGroup?.homeTeam.alias"
                        append="1"
                        append-color="warning"
                      />

                      <GroupTeamItem
                        :title="doubleRoundItemGroup?.awayTeam.alias"
                        append="1"
                        append-color="warning"
                      />
                    </v-card-item>
                  </v-card>
                </v-col>
              </v-row>
            </template>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-item>
    </v-card>

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
import GroupTeamItem from "@/components/tournaments/groups/GroupTeamItem.vue";

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
  generateModes();
}

onMounted(async () => {
  await getData();
});

function groupBy(list, keyGetter) {
  console.warn("groupBy", list, keyGetter);
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  console.warn("map", map);
  return map;
}

// Generate and get games
const doubleRound = ref(undefined);
const singleRound = ref(undefined);
const simpleCup = ref(undefined);

function generateModes() {
  doubleRound.value = generator(teams.value, { type: "double-round" });

  singleRound.value = generator(teams.value, { type: "single-round" });

  simpleCup.value = generator(teams.value, { type: "simple-cup" });
}

const doubleRoundGroupedByRound = computed(() => {
  if (doubleRound.value) {
    console.warn(doubleRound.value);
    return groupBy(
      doubleRound.value?.data,
      (doubleRoundItem) => doubleRoundItem.round,
    );
  }
  return [];
});
</script>
