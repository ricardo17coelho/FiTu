<template>
  <v-text-field
    v-bind="$attrs"
    :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
    :rules="[rules.required, rules.min]"
    :type="show ? 'text' : 'password'"
    name="input-10-2"
    label="Visible"
    hint="At least 8 characters"
    class="input-group--focused"
    @click:append="show = !show"
  ></v-text-field>
</template>

<script setup lang="ts">
import { ref } from "vue";

// defineProps<{
//   modelValue: boolean;
// }>();

// const emit = defineEmits<{
//   (e: "update:modelValue", value: boolean): void;
// }>();

const rules = {
  required: (value) => !!value || "Required.",
  min: (v) => v.length >= 8 || "Min 8 characters",
};

const show = ref(false);
</script>
