<template>
  <VBtnDev @click="updateLogos">DEV: updateLogos</VBtnDev>
  <AppTable
    title="Clubs"
    :items="clubs"
    :headers="headers"
    @click:edit:item="onClickEditItem"
    @click:delete:item="onClickDeleteItem"
  >
    <template #toolbar-extension>
      <v-row class="mx-1">
        <v-col>
          <v-autocomplete
            v-model="currentNation"
            density="compact"
            label="Nation"
            :items="nations"
            item-value="id"
            item-title="name"
            :return-object="false"
            @update:model-value="getLeaguesByNationId"
          />
        </v-col>
        <v-col>
          <v-autocomplete
            v-model="currentLeague"
            label="League"
            density="compact"
            :disabled="!currentNation"
            :items="leagues"
            item-value="id"
            item-title="name"
            :return-object="false"
            @update:model-value="getClubsByLeagueId"
          />
        </v-col>
      </v-row>
    </template>
  </AppTable>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { supabase } from "@/services/supabase";
import AppTable from "@/components/AppTable.vue";
import axios from "axios";

// const currentClub = ref(undefined);
const clubs = ref([]);

const headers = ref([
  {
    title: "ID",
    align: "start",
    sortable: false,
    key: "id",
  },
  { title: "Name", key: "name" },
  { title: "LeagueID", key: "league" },
  { title: "Logo", key: "logoUrl" },
]);
async function getClubs() {
  let { data } = await supabase.from("clubs").select("*");
  clubs.value = data;
}

async function getClubsByLeagueId(leagueId: string) {
  let { data } = await supabase
    .from("clubs")
    .select("*")
    .eq("league", leagueId);

  clubs.value = data;
}

onMounted(async () => {
  await getClubs();
});

function onClickEditItem(item) {
  console.warn("onClickEditItem", item);
}

function onClickDeleteItem(item) {
  console.warn("onClickDeleteItem", item);
}

/* NATIONS */
const nations = ref([]);
const currentNation = ref(undefined);
async function getNations() {
  let { data, error } = await supabase.from("nations").select("*");
  console.warn("data", data);
  console.warn("error", error);
  nations.value = data;
}

onMounted(async () => {
  await getNations();
});

/* LEAGUES */
const leagues = ref([]);
const currentLeague = ref(undefined);
async function getLeaguesByNationId(nationId: string) {
  if (!nationId) {
    await getClubs();
    return;
  }
  let { data, error } = await supabase
    .from("leagues")
    .select("*")
    .eq("nationId", nationId);

  console.warn("data", data);
  console.warn("error", error);
  leagues.value = data;
}

// ----------------------
// DEV
// ----------------------
async function updateById(id: string, body) {
  const { data } = await supabase.from("clubs").update(body).eq("id", id);

  if (data) {
    return data;
  }
  return null;
}

async function uploadLogo(name, logo) {
  console.warn("uploadLogo", name, logo);
  const { data } = await supabase.storage
    .from("logos")
    .upload(`clubs/${name}`, logo, {
      cacheControl: "3600",
      upsert: false,
    });
  if (data) {
    return data;
  }
  return null;
}

async function updateLogos() {
  for (const idx in clubs.value) {
    let club = clubs.value[idx];
    console.warn("clubs", clubs);
    try {
      const { data } = await axios.get(`/clubs/${club.id}/image`, {
        responseType: "blob",
        timeout: 30000,
      });
      const { Key: logoKey } = await uploadLogo(club.id, data);
      console.warn("logoKey", logoKey);
      const logoUrlPath = logoKey.substring(logoKey.indexOf("/") + 1);
      const { publicURL } = supabase.storage
        .from("logos")
        .getPublicUrl(logoUrlPath);
      console.warn("publicURL", publicURL);
      if (publicURL) {
        const bodyData = { logoUrl: publicURL };
        console.warn("bodyData", bodyData);
        await updateById(club.id, bodyData);
      }
    } catch (e) {
      console.error(e);
    }
  }
}
</script>
