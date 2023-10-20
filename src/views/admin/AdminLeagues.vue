<template>
  <VBtnDev @click="updateLogos">DEV: updateLogos</VBtnDev>
  <AppTable
    title="Leagues"
    :items="leagues"
    :headers="headers"
    @click:edit:item="onClickEditItem"
    @click:delete:item="onClickDeleteItem"
  >
  </AppTable>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { supabase } from "@/services/supabase";
import axios from "axios";
import AppTable from "@/components/AppTable.vue";

// const currenLeague = ref(undefined);
const leagues = ref([]);

const headers = ref([
  {
    title: "ID",
    align: "start",
    sortable: false,
    key: "id",
  },
  { title: "Name", key: "name" },
  { title: "Logo", key: "logoUrl" },
]);
async function getLeagues() {
  const { data } = await supabase().from("leagues").select("*");
  leagues.value = data;
}

onMounted(async () => {
  await getLeagues();
});

function onClickEditItem(item) {
  console.warn("onClickEditItem", item);
}

function onClickDeleteItem(item) {
  console.warn("onClickDeleteItem", item);
}

// ----------------------
// DEV
// ----------------------
async function updateById(id: string, body) {
  const { data } = await supabase().from("leagues").update(body).eq("id", id);

  if (data) {
    return data;
  }
  return null;
}

async function uploadLogo(name, logo) {
  console.warn("uploadLogo", name, logo);
  const { data } = await supabase()
    .storage.from("logos")
    .upload(`leagues/${name}`, logo, {
      cacheControl: "3600",
      upsert: false,
    });
  if (data) {
    return data;
  }
  return null;
}

async function updateLogos() {
  for (const idx in leagues.value) {
    const league = leagues.value[idx];
    console.warn("league", league);
    try {
      const { data } = await axios.get(`/leagues/${league.id}/image`, {
        responseType: "blob",
        timeout: 30000,
      });
      const { Key: logoKey } = await uploadLogo(league.id, data);
      console.warn("logoKey", logoKey);
      const logoUrlPath = logoKey.substring(logoKey.indexOf("/") + 1);
      const { publicURL } = supabase()
        .storage.from("logos")
        .getPublicUrl(logoUrlPath);
      console.warn("publicURL", publicURL);
      if (publicURL) {
        const bodyData = { logoUrl: publicURL };
        console.warn("bodyData", bodyData);
        await updateById(league.id, bodyData);
      }
    } catch (e) {
      console.error(e);
    }
  }
}
</script>
