<template>
  <v-app>
    <v-main class="fill-height">
      <slot />
    </v-main>
  </v-app>
</template>

<script setup lang="ts"></script>

<style scoped>
/* opcjonalnie — lekki background */
.v-main {
  background: #f4f5f7;
}
</style>
