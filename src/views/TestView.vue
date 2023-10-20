<template>
  <v-row>
    <v-col>
      <v-btn @click="getNations">getNations ({{ nations.length }})</v-btn>
      <v-btn @click="getFutDBNations(1)"
        >getFutDBNations ({{ nations.length }})</v-btn
      >
      <v-combobox
        v-model="currentNation"
        :items="nations"
        item-value="id"
        item-title="name"
        :return-object="false"
        @update:model-value="getLeaguesByNationId"
      />
    </v-col>
    <v-col>
      <v-btn @click="getLeagues">getLeagues ({{ leagues.length }})</v-btn>
      <v-btn @click="getFutDBLeagues(1)">
        getFutDBLeagues ({{ leagues.length }})
      </v-btn>
      <v-combobox
        v-model="currentLeague"
        :disabled="!currentNation"
        :items="leagues"
        item-value="id"
        item-title="name"
        :return-object="false"
        @update:model-value="getClubsByLeagueId"
      />
    </v-col>
    <v-col>
      <v-btn @click="getClubs">getClubs ({{ clubs.length }})</v-btn>
      <v-btn @click="getFutDBClubs(1)">
        getFutDBClubs ({{ clubs.length }})
      </v-btn>
      <v-combobox
        v-model="currentClub"
        :disabled="!currentLeague"
        :items="clubs"
        item-value="id"
        item-title="name"
      />
    </v-col>
  </v-row>

  <v-btn @click="updateClubsLogos" color="error">updateClubsLogos</v-btn>
  <v-btn @click="getAllLogosClubs" color="warning">getAllLogosClubs</v-btn>
  <v-btn @click="updateFutDBClubs(1)">updateFutDBClubs</v-btn>
  <v-btn @click="updateFutDBLeagues(1)">updateFutDBLeagues</v-btn>
  <v-btn @click="updateFutDBNations(1)">updateFutDBNations</v-btn>

  <v-container>
    <v-card>
      <v-card-title> LOGOS </v-card-title>
      <v-card-text style="overflow-y: auto; max-height: 500px">
        <v-row>
          <template v-for="club in clubs" :key="club.id">
            <v-col>
              <v-card>
                <v-card-title> {{ club.name }} </v-card-title>
                <v-card-text>
                  <v-img :src="club.logoUrl" width="100" />
                </v-card-text>
              </v-card>
            </v-col>
          </template>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { supabase } from "@/services/supabase";
import axios from "axios";
import { onMounted } from "vue";

onMounted(async () => {
  // await getClubs();
  await getNations();
  // await getLeagues();
});

/* CLUBS */
const currentClub = ref(undefined);
const clubs = ref([]);
async function getClubs() {
  const { data, error } = await supabase().from("clubs").select("*");
  console.warn("data", data);
  console.warn("error", error);
  clubs.value = data;
}
async function getClubsByLeagueId(leagueId: string) {
  const { data, error } = await supabase()
    .from("clubs")
    .select("*")
    .eq("league", leagueId);
  console.warn("data", data);
  console.warn("error", error);
  clubs.value = data;
  currentClub.value = undefined;
}
async function addClub(params) {
  const { data, error } = await supabase()
    .from("clubs")
    .insert([params])
    .select();

  console.warn(error);
  console.warn("data", data);
}

async function updateClubById(id: string, body) {
  const { data, error } = await supabase()
    .from("clubs")
    .update(body)
    .eq("id", id);

  console.warn(error);
  console.warn("data", data);
  if (data) {
    return data;
  }
  return null;
}

async function getFutDBClubs(page = 1) {
  const { data } = await axios.get(`/clubs`, {
    params: {
      page,
    },
  });
  return data;
}

async function updateFutDBClubs(page = 1) {
  try {
    const data = await getFutDBClubs(page);
    const { items, pagination } = data;
    /* Pagination
     * countCurrent : 20
     * countTotal: 748
     * itemsPerPage: 20
     * pageCurrent: 1
     * pageTotal: 38
     * **/
    console.warn("items", items);
    console.warn("pagination", pagination);
    for (const itemIdx in items) {
      await addClub(items[itemIdx]);
    }
    if (pagination.pageCurrent < pagination.pageTotal) {
      await updateFutDBClubs(pagination.pageCurrent + 1);
    }
  } catch (e) {
    console.error(e);
  }
}

/* LEAGUES */
const leagues = ref([]);
const currentLeague = ref(undefined);
async function getLeagues() {
  const { data, error } = await supabase().from("leagues").select("*");
  console.warn("data", data);
  console.warn("error", error);
  leagues.value = data;
}
async function getLeaguesByNationId(nationId: string) {
  console.warn("getLeaguesByNationId", nationId);
  const { data, error } = await supabase()
    .from("leagues")
    .select()
    .eq("nationId", nationId);
  console.warn("data", data);
  console.warn("error", error);
  leagues.value = data;
  clubs.value = [];
  currentClub.value = undefined;
  currentLeague.value = undefined;
}
async function addLeague(params) {
  const { data, error } = await supabase()
    .from("leagues")
    .insert([params])
    .select();

  console.warn(error);
  console.warn("data", data);
}

async function getFutDBLeagues(page = 1) {
  const { data } = await axios.get(`/leagues`, {
    params: {
      page,
    },
  });
  return data;
}

async function updateFutDBLeagues(page = 1) {
  try {
    const data = await getFutDBLeagues(page);
    const { items, pagination } = data;
    /* Pagination
     * countCurrent : 20
     * countTotal: 748
     * itemsPerPage: 20
     * pageCurrent: 1
     * pageTotal: 38
     * **/
    console.warn("items", items);
    console.warn("pagination", pagination);
    for (const itemIdx in items) {
      await addLeague(items[itemIdx]);
    }
    if (pagination.pageCurrent < pagination.pageTotal) {
      await updateFutDBLeagues(pagination.pageCurrent + 1);
    }
  } catch (e) {
    console.error(e);
  }
}

/* NATIONS */
const nations = ref([]);
const currentNation = ref(undefined);
async function getNations() {
  const { data, error } = await supabase().from("nations").select("*");
  console.warn("data", data);
  console.warn("error", error);
  nations.value = data;
}
async function addNation(params) {
  const { data, error } = await supabase()
    .from("nations")
    .insert([params])
    .select();

  console.warn(error);
  console.warn("data", data);
}

async function getFutDBNations(page = 1) {
  try {
    const { data } = await axios.get(`/nations`, {
      params: {
        page,
      },
    });

    console.warn("data", data);

    return data;
  } catch (e) {
    console.error(e);
  }
}

async function updateFutDBNations(page = 1) {
  try {
    const data = await getFutDBNations(page);
    console.warn("data", data);
    const { items, pagination } = data;
    /* Pagination
     * countCurrent : 20
     * countTotal: 748
     * itemsPerPage: 20
     * pageCurrent: 1
     * pageTotal: 38
     * **/
    console.warn("items", items);
    console.warn("pagination", pagination);
    for (const itemIdx in items) {
      await addNation(items[itemIdx]);
    }
    if (pagination.pageCurrent < pagination.pageTotal) {
      await updateFutDBNations(pagination.pageCurrent + 1);
    }
  } catch (e) {
    console.error(e);
  }
}

// const clubsLogos = ref([]);
async function updateClubsLogos() {
  for (const clubIdx in clubs.value) {
    // if (Number(clubIdx) < 10) {
    const club = clubs.value[clubIdx];
    console.warn("club", club);
    try {
      const { data } = await axios.get(`/clubs/${club.id}/image`, {
        responseType: "blob",
        timeout: 30000,
      });
      const { Key: clubUrl } = await uploadClubsLogos(club.id, data);
      console.warn("clubUrl", clubUrl);
      const clubUrlPath = clubUrl.substring(clubUrl.indexOf("/") + 1);
      const { publicURL } = supabase()
        .storage.from("logos")
        .getPublicUrl(clubUrlPath);
      console.warn("publicURL", publicURL);
      if (publicURL) {
        const bodyData = { logoUrl: publicURL };
        console.warn("bodyData", bodyData);
        await updateClubById(club.id, bodyData);
      }
    } catch (e) {
      console.error(e);
    }
  }
  // }
}

async function uploadClubsLogos(name, logo) {
  console.warn("uploadClubsLogos", name, logo);
  const { data, error } = await supabase()
    .storage.from("logos")
    .upload(`clubs/${name}`, logo, {
      cacheControl: "3600",
      upsert: false,
    });
  console.warn("data", data);
  console.error("error", error);
  if (data) {
    return data;
  }
  return null;
}

async function getAllLogosClubs() {
  const { data, error } = await supabase()
    .storage.from("logos")
    .list("clubs", {
      limit: 100,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    });

  console.warn("getAllLogosClubs", data, error);
}

// const testFile = ref(undefined);
// const handleFileSelected = (e) => {
//   testFile.value = e.target.files[0];
// };
//
// const handleSubmit = async (e) => {
//   console.warn("testFile", testFile.value);
//   e.preventDefault();
//   const filename = `${testFile.value?.name}`;
//   console.warn(typeof testFile.value);
//
//   const { data, error } = await supabase().storage
//     .from("logos")
//     .upload(filename, testFile.value, {
//       cacheControl: "3600",
//       upsert: false,
//     });
// };

// function getImageUrlFromBlob(imageBlob: Blob) {
//   return (
//     "data:image/png;base64," +
//     btoa(
//       new Uint8Array(imageBlob).reduce(
//         (data, byte) => data + String.fromCharCode(byte),
//         ""
//       )
//     )
//   );
// }

// async function getLogoPublicUrl(logoUrl: string) {
//   const result = logoUrl.substring(logoUrl.indexOf("/") + 1);
//   console.warn("result", result);
//   const { publicURL } = supabase().storage.from("logos").getPublicUrl(result);
//   console.warn("publicURL", publicURL);
//   return publicURL;
// }
</script>
