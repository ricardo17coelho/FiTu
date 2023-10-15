<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center" class="fill-height">
      <v-card min-width="500">
        <v-card-title>
          <h1 class="mx-auto mb-4 text-4xl font-bold">FiTu</h1>
        </v-card-title>
        <v-card-text>
          <router-view />
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>
<script lang="ts" setup></script>
