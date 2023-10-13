<template>
  <h1 class="text-3xl font-medium">Home</h1>
  <VBtnDev @click="getMyClaims">getMyClaims</VBtnDev>
  <VBtnDev @click="setRole('SUPER_ADMIN')">SUPER_ADMIN</VBtnDev>
  <VBtnDev @click="isClaimAdmin">isClaimAdmin</VBtnDev>
  <pre>{{ supabase.auth.user() }}</pre>
</template>
<script setup lang="ts">
import { supabase } from "@/services/supabase";

async function getMyClaims() {
  // const { data, error } = await supabase.rpc("get_my_claim", {
  //   claim: "userrole",
  // });
  const { data, error } = await supabase.rpc("get_my_claims");
  if (error) console.error("getMyClaims error", error);
  console.warn(data);
}

async function isClaimAdmin() {
  const { data, error } = await supabase.rpc("is_claims_admin");
  if (error) console.error("getMyClaims error", error);
  console.warn(data);
}

async function setClaim({ uid, claim, value }) {
  const { data, error } = await supabase.rpc("set_claim", {
    uid,
    claim,
    value,
  });
  if (error) console.error("setClaim error", error);
  console.warn("setClaim", data);
}

async function setRole(role: string) {
  await setClaim({
    uid: supabase.auth.user()?.id,
    claim: "userrole",
    value: `'${role}'`,
  });
}
</script>
