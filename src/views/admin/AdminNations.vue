<template>
  <VBtnDev @click="updateLogos">DEV: updateLogos</VBtnDev>
  <AppTable
    title="Nations"
    :items="nations"
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

// const currenNation = ref(undefined);
const nations = ref([]);

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
async function getNations() {
  const { data } = await supabase().from("nations").select("*");
  nations.value = data;
}

onMounted(async () => {
  await getNations();
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
  const { data } = await supabase().from("nations").update(body).eq("id", id);

  if (data) {
    return data;
  }
  return null;
}

async function uploadLogo(name, logo) {
  console.warn("uploadLogo", name, logo);
  const { data } = await supabase()
    .storage.from("logos")
    .upload(`nations/${name}`, logo, {
      cacheControl: "3600",
      upsert: false,
    });
  if (data) {
    return data;
  }
  return null;
}

async function updateLogos() {
  for (const idx in nations.value) {
    const nation = nations.value[idx];
    console.warn("nation", nation);
    try {
      const { data } = await axios.get(`/nations/${nation.id}/image`, {
        responseType: "blob",
        timeout: 30000,
      });
      const { Key: logoKey } = await uploadLogo(nation.id, data);
      console.warn("logoKey", logoKey);
      const logoUrlPath = logoKey.substring(logoKey.indexOf("/") + 1);
      const { publicURL } = supabase()
        .storage.from("logos")
        .getPublicUrl(logoUrlPath);
      console.warn("publicURL", publicURL);
      if (publicURL) {
        const bodyData = { logoUrl: publicURL };
        console.warn("bodyData", bodyData);
        await updateById(nation.id, bodyData);
      }
    } catch (e) {
      console.error(e);
    }
  }
}
</script>
