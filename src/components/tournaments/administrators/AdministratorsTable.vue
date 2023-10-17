<template>
  <AppTable
    title="Administrators"
    :items="administrators"
    :headers="headers"
    @click:add="dialogAdd = true"
  >
  </AppTable>
  <v-dialog v-model="dialogAdd" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="text-h5">Add Administrator</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <!--
               TODO: allow only emails from registered users
               do some API like: getUidForEmail, which gets the User ID by email
               -->
              <v-text-field
                v-model="administrator.email"
                label="Administrator email"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="blue-darken-1" variant="text" @click="onSavePlayer">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { supabase } from "@/services/supabase";
import AppTable from "@/components/AppTable.vue";

const props = defineProps({
  tournamentId: {
    type: String,
    default: null,
  },
});

const administrators = ref([]);

const headers = ref([
  { title: "Name", key: "name" },
  { title: "Email", key: "email" },
]);
async function getData() {
  const { data, error } = await supabase
    .from("tournament_administrators")
    .select("*")
    .eq("tournamentId", props.tournamentId);
  if (error) {
    console.error("Error on get administrators");
    return;
  }
  administrators.value = data;
}

onMounted(async () => {
  await getData();
});

const dialogAdd = ref(false);

const administrator = ref({
  name: ref(""),
  email: ref(""),
});

async function onSavePlayer() {
  const { data, error } = await supabase
    .from("tournament_administrators")
    .insert([{ ...administrator.value, tournamentId: props.tournamentId }])
    .select();

  if (error) {
    console.error("Error on add tournament_administrators");
    return;
  }
  console.info("Saved!", data);
}
</script>
