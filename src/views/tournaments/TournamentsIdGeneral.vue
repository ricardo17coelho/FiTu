<template>
  <div>
    <VBtnDev @click="testTournament">TEST</VBtnDev>
    <v-container>
      <v-card title="Create Tournament">
        <template #item>
          <v-form>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="newTournamentForm.name"
                  label="Name"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </template>
        <template #actions>
          <VBtnPrimary @click="onCreateTournament">
            Create Tournament
          </VBtnPrimary>
        </template>
      </v-card>
    </v-container>
    <VBtnPrimary @click="onTournamentGetAll">GET ALL Tournaments</VBtnPrimary>

    <JsonTreeView
      :data="
        JSON.stringify({
          currentTournamentId,
          currentTournament,
          tournaments: tournamentOrganizer.tournaments,
        })
      "
    />
    <v-container v-if="tournaments.length > 0">
      <VBtnDev @click="currentTournamentId = undefined">Clear</VBtnDev>
      <v-row>
        <v-col v-for="tournament in tournaments" :key="tournament.id">
          <v-card
            :title="tournament.name"
            @click="onSetCurrentTournament(tournament)"
          >
            <template #item>
              <JsonTreeView
                :data="
                  JSON.stringify({
                    tournament,
                  })
                "
              />
            </template>
            <template #actions>
              <VBtnDelete
                @click.stop="onTournamentDeleteById(tournament.id)"
              ></VBtnDelete>
            </template>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container v-if="currentTournament">
      <VBtnPrimary
        v-if="currentTournamentStatus === 'setup'"
        @click="onAddPlayersToTournament"
      >
        Add Players Tournament
      </VBtnPrimary>
      {{ currentTournamentStatus }}
      <v-card title="MyTournament">
        <template #item>
          <JsonTreeView
            :data="
              JSON.stringify({
                currentTournament,
                players,
              })
            "
          />
        </template>
        <template v-if="currentTournament.players.length > 0" #actions>
          <VBtnPrimary @click="onTournamentStart"> Start</VBtnPrimary>
          <VBtnPrimary @click="onTournamentEnd"> End</VBtnPrimary>
        </template>
      </v-card>

      <v-card v-if="currentTournamentStatus !== 'setup'" title="Standings">
        <template #item>
          <JsonTreeView
            :data="
              JSON.stringify({
                currentTournamentStandings,
              })
            "
          />
          <v-data-table
            :items="currentTournamentStandings"
            :headers="[
              { id: 'position', value: 'position', title: 'Position' },
              { id: 'player', value: 'player', title: 'Player' },
              { id: 'matches', value: 'matches', title: 'PLD' },
              { id: 'matchPoints', value: 'matchPoints', title: 'PTS' },
            ]"
          >
            <template #[`item.position`]="{ index }">
              {{ index + 1 }}
            </template>
            <template #[`item.player`]="{ item }">
              {{ item.player?.name }}
            </template>
            <template #[`item.matches`]="{ item }">
              {{ item.matches }}
            </template>
            <template #[`item.matchPoints`]="{ item }">
              {{ item.matchPoints }}
            </template>
          </v-data-table>
        </template>
      </v-card>

      <v-card>
        <v-card-title>
          Group
          <!-- TODO: button to edit, delete -->
        </v-card-title>

        <v-card-item>
          <v-expansion-panels>
            <v-expansion-panel
              v-for="(matchRound, matchRoundIdx) in matches"
              :key="`double-round-item-${matchRoundIdx}`"
              :title="`Round: ${matchRoundIdx + 1}`"
            >
              <template #text>
                <v-row>
                  <v-col
                    v-for="(match, matchIdx) in matchRound[1]"
                    :key="`match-${matchIdx}`"
                  >
                    <v-card class="red">
                      <v-card-title class="text-body-1">
                        {{ match.id }}
                      </v-card-title>
                      <v-card-item>
                        <GroupTeamItem
                          v-if="getTournamentPlayerById(match?.player1.id)"
                          :title="
                            getTournamentPlayerById(match?.player1.id).name
                          "
                          append="1"
                          append-color="warning"
                          @click="onSetCurrentTournamentResult(match.id, 4, 5)"
                        />

                        <GroupTeamItem
                          v-if="getTournamentPlayerById(match?.player2.id)"
                          :title="
                            getTournamentPlayerById(match?.player2.id).name
                          "
                          append="1"
                          append-color="warning"
                          @click="onSetCurrentTournamentResult(match.id, 4, 5)"
                        />
                      </v-card-item>
                    </v-card>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <VBtnPrimary @click="currentTournament.next()">
                      NextRound
                    </VBtnPrimary>
                  </v-col>
                </v-row>
              </template>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-item>
      </v-card>

      <v-card title="Matches">
        <template #item>
          <JsonTreeView
            :data="
              JSON.stringify({
                matches,
              })
            "
          />
        </template>
        <template #actions>
          <!--        <VBtnPrimary @click="addResults"> addResults </VBtnPrimary>-->
        </template>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { JsonTreeView } from "json-tree-view-vue3";
import TournamentOrganizer from "tournament-organizer";
import { StandingsValues } from "tournament-organizer/dist/interfaces/StandingsValues";
import { computed, onMounted } from "vue";
import GroupTeamItem from "@/components/tournaments/groups/GroupTeamItem.vue";
import { supabase } from "@/services/supabase";
import { TournamentValues } from "tournament-organizer/dist/interfaces/TournamentValues";
import { PlayerValues } from "tournament-organizer/dist/interfaces/PlayerValues";
import { MatchValues } from "tournament-organizer/dist/interfaces/MatchValues";

const tournamentOrganizer = new TournamentOrganizer();

function testTournament() {
  const testTournament = tournamentOrganizer.createTournament("TEST", {
    scoring: {
      win: 3,
      draw: 1,
      loss: 0,
    },
    stageOne: {
      format: "round-robin",
    },
    stageTwo: {
      format: "single-elimination",
    },
  });

  console.warn("testTournament", testTournament);

  const players = [
    "Joe Doe",
    "Elon Musk",
    "Ronaldo",
    "Messi",
    "J. Felix",
    "Di Maria",
    "Rafa",
    "Mbappe",
  ];
  players.forEach((player) => {
    const createdPlayer = testTournament.createPlayer(player);
    console.warn(`Player: ${createdPlayer.name} created`);
  });

  console.warn("testTournament: status", testTournament.status);
  testTournament.start();
  console.warn("testTournament: status", testTournament.status);

  console.warn("testTournament: matches", testTournament.matches);
  console.warn("testTournament: players", testTournament.players);
  console.warn("testTournament: standings", testTournament.standings());
}

const currentTournamentId = ref();

const NEW_TOURNAMENT_FORM_INITIAL = {
  name: "",
};

const newTournamentForm = ref({
  ...NEW_TOURNAMENT_FORM_INITIAL,
});
async function onCreateTournament() {
  const newTournamentFormCopy = { ...newTournamentForm.value };
  const { name } = newTournamentFormCopy;
  delete newTournamentFormCopy.name;
  const newTournament = tournamentOrganizer.createTournament(name, {
    scoring: {
      win: 3,
      draw: 1,
      loss: 0,
    },
    stageOne: {
      format: "round-robin",
    },
    stageTwo: {
      format: "single-elimination",
    },
    ...newTournamentFormCopy,
  });

  try {
    await onTournamentSave(newTournament);
    currentTournamentId.value = newTournament.id;
    newTournamentForm.value = { ...NEW_TOURNAMENT_FORM_INITIAL };
    tournaments.value.push(newTournament);
  } catch (e) {
    console.error(e);
  }
}

const currentTournament = computed(() => {
  if (currentTournamentId.value) {
    const idx = tournamentOrganizer.tournaments.findIndex(
      (t) => t.id === currentTournamentId.value,
    );
    console.warn("idx", idx);
    return idx !== -1 ? tournamentOrganizer.tournaments[idx] : undefined;
  }
  return undefined;
});

function onSetCurrentTournament(tournament: TournamentValues) {
  console.warn("tournament", tournament);
  const tournamentIdx = tournamentOrganizer.tournaments.findIndex(
    (t) => t.id === tournament.id,
  );
  if (tournamentIdx === -1) {
    tournamentOrganizer.reloadTournament(tournament);
  }
  currentTournamentId.value = tournament.id;
}

async function onAddPlayersToTournament() {
  const tmpPlayers = [
    "Ricardo",
    "Vitti",
    "Jonni",
    "Aleksej",
    "Kevin",
    "Juan",
    "Will",
    "Gian",
  ];

  for (const tmpPlayersIdx in tmpPlayers) {
    const tmpPlayer = tmpPlayers[tmpPlayersIdx];
    const player = currentTournament.value?.createPlayer(tmpPlayer);
    console.warn("player", player);
    if (player) {
      await onPlayerSave(player, currentTournamentId.value);
      currentTournament.value?.players.push(player);

      tournaments.value = tournaments.value.map((obj) => {
        if (obj.id === currentTournamentId.value) {
          return { ...obj, players: [...obj.players, player] };
        }

        return obj;
      });
    }
  }
}

async function onTournamentStart() {
  console.warn("currentTournament.value", currentTournament.value?.matches);
  try {
    currentTournament.value?.start();
    onTournamentUpdate(currentTournament.value);
    for (const matchIdx in currentTournament.value?.matches) {
      const match = currentTournament.value?.matches[matchIdx];
      await onMatchSave(match, currentTournamentId.value);
    }
  } catch (e) {
    console.error(e);
  }
}

function onTournamentEnd() {
  try {
    currentTournament.value?.end();
    onTournamentUpdate(currentTournament.value);
  } catch (e) {
    console.error(e);
  }
}

const currentTournamentStatus = computed(() => currentTournament.value?.status);

// Get all active matches
const matches = computed(() => {
  if (currentTournamentId) {
    return groupBy(currentTournament.value?.matches, (match) => match.round);
    // return currentTournament.value?.matches;
  }
  return [];
});

const players = computed(() => currentTournament.value?.players);

const currentTournamentStandings = computed(
  () => currentTournament.value?.standings(),
);

function getFormattedMatches(tMatches: MatchValues[]) {
  return groupBy(tMatches, (match: MatchValues) => match.round);
}

// Record a result
// function addResults() {
//   currentTournament.enterResult(matches.value[0].id, 0, 1);
//   currentTournament.enterResult(matches.value[1].id, 1, 0);
// }

// Get standings

// const currentTournamentStandings = ref<StandingsValues | undefined>(undefined);
// function onGetStandings() {
//   console.warn("currentTournament", currentTournament.value);
//   currentTournamentStandings.value = currentTournament.value?.standings();
// }

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

function onSetCurrentTournamentResult(
  matchId: string,
  player1Wins: number = 0,
  player2Wins: number = 0,
  draws?: number,
) {
  try {
    currentTournament.value?.enterResult(
      matchId,
      player1Wins,
      player2Wins,
      draws,
    );
  } catch (e) {
    console.error(e);
  }
}

function getTournamentPlayerById(playerId: string) {
  console.warn("getTournamentPlayerById", playerId);
  const result = currentTournament.value?.players.find(
    (p) => p.id === playerId,
  );
  console.warn("getTournamentPlayerById result", result);
  return result;
}

/*****************************************
 *
 *                TOURNAMENTS
 *
 ******************************************/

async function onTournamentSave(tournamentData: TournamentValues) {
  console.warn("onTournamentSave", tournamentData);
  const newTournamentData = {
    ...tournamentData,
    // tournament_teams: tournamentData.players,
    // tournament_matches: tournamentData.matches,
  };
  delete newTournamentData.matches;
  delete newTournamentData.players;
  const { data, error } = await supabase()
    .from("tournaments")
    .insert([newTournamentData])
    .select();

  if (error) {
    console.error("Error on add tournament");
    return Promise.reject(error);
  }
  console.info("Saved!", data);
  return Promise.resolve(data);
}

async function onTournamentUpdate(tournamentData: TournamentValues) {
  console.warn("onTournamentUpdate", tournamentData);
  const newTournamentData = {
    ...tournamentData,
    // tournament_teams: tournamentData.players,
    // tournament_matches: tournamentData.matches,
  };
  delete newTournamentData.matches;
  delete newTournamentData.players;
  const { data, error } = await supabase()
    .from("tournaments")
    .update(newTournamentData)
    .eq("id", newTournamentData.id);

  if (error) {
    console.error("Error on update tournament");
    return;
  }
  console.info("Saved!", data);
}

async function onTournamentDeleteById(tournamentId: string) {
  console.warn("onTournamentDeleteById", tournamentId);

  const { error } = await supabase()
    .from("tournaments")
    .delete()
    .eq("id", tournamentId);

  if (error) {
    console.error("Error on delete tournament");
    return;
  }
  console.info("Deleted!");

  tournaments.value = tournaments.value.filter((t) => t.id !== tournamentId);
  tournamentOrganizer.removeTournament(tournamentId);
  if (tournamentId === currentTournamentId.value) {
    currentTournamentId.value = undefined;
  }
}

const tournaments = ref<TournamentValues[]>([]);
async function onTournamentGetAll() {
  let { data, error } = await supabase().from("tournaments").select(`
    *,
    players:tournament_teams(*),
    matches:tournament_matches(*)
    `);
  // tournament_teams(*)

  if (error) {
    console.error("Error on get tournament");
    return;
  }
  tournaments.value = data;
}

onMounted(() => onTournamentGetAll());

/*****************************************
 *
 *                PLAYERS
 *
 ******************************************/
async function onPlayerSave(playerData: PlayerValues, tournamentId: string) {
  console.warn("onPlayerSave", playerData);
  const newPlayerData = {
    ...playerData,
    tournamentId,
  };
  delete newPlayerData.matches;
  const { data, error } = await supabase()
    .from("tournament_teams")
    .insert([newPlayerData])
    .select();

  if (error) {
    console.error("Error on add player");
    return Promise.reject(error);
  }
  console.info("Saved!", data);
  return Promise.resolve(data);
}

async function onPlayerUpdate(playerData: PlayerValues) {
  console.warn("onPlayerUpdate", playerData);
  const newPlayerData = {
    ...playerData,
  };
  delete newPlayerData.matches;
  const { data, error } = await supabase()
    .from("tournament_teams")
    .update(newPlayerData)
    .eq("id", newPlayerData.id);

  if (error) {
    console.error("Error on update player");
    return;
  }
  console.info("Saved!", data);
}

async function onPlayerDeleteById(playerId: string) {
  console.warn("onPlayerDeleteById", playerId);

  const { error } = await supabase()
    .from("tournament_teams")
    .delete()
    .eq("id", playerId);

  if (error) {
    console.error("Error on delete player");
    return;
  }
  console.info("Deleted!");
}
/*****************************************
 *
 *                MATCHES
 *
 ******************************************/

async function onMatchSave(matchData: MatchValues, tournamentId: string) {
  console.warn("onMatchSave", matchData);
  const newPlayerData = {
    ...matchData,
    tournamentId,
  };
  const { data, error } = await supabase()
    .from("tournament_matches")
    .insert([newPlayerData])
    .select();

  if (error) {
    console.error("Error on add match");
    return Promise.reject(error);
  }
  console.info("Saved!", data);
  return Promise.resolve(data);
}
</script>

<style scoped></style>
