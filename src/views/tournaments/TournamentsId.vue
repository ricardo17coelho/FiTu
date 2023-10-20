<template>
  <div>{{ tournament }}</div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { supabase } from "@/services/supabase";

const props = defineProps({
  id: {
    type: String,
    default: null,
  },
});

const tournament = ref(undefined);

async function getData() {
  const { data, error } = await supabase()
    .from("tournaments")
    .select("*")
    .eq("id", props.id);
  console.warn("getData", data);
  if (error) {
    console.error("Error on get tournaments");
    return;
  }
  tournament.value = data;
}

onMounted(async () => {
  await getData();
});
</script>
