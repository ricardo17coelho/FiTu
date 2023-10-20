<template>
  <h1 class="text-3xl font-medium">Home</h1>
  <pre>{{ currentUser }}</pre>
</template>
<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";

const { currentUser } = useAuthStore();

// async function getMyClaims() {
//   // const { data, error } = await supabase().rpc("get_my_claim", {
//   //   claim: "userrole",
//   // });
//   const { data, error } = await supabase().rpc("get_my_claims");
//   if (error) console.error("getMyClaims error", error);
//   console.warn(data);
// }
//
// async function isClaimAdmin() {
//   const { data, error } = await supabase().rpc("is_claims_admin");
//   if (error) console.error("getMyClaims error", error);
//   console.warn(data);
// }
//
// async function setClaim({ uid, claim, value }) {
//   const { data, error } = await supabase().rpc("set_claim", {
//     uid,
//     claim,
//     value,
//   });
//   if (error) console.error("setClaim error", error);
//   console.warn("setClaim", data);
// }
//
// async function setRole(role: string) {
//   await setClaim({
//     uid: supabase().auth.getUser()?.id,
//     claim: "userrole",
//     value: `'${role}'`,
//   });
// }
</script>
