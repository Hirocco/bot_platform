<script setup lang="ts">
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
</script>

<template>
  <DashboardLayout>
    <v-container class="fill-height pa-5 d-flex flex-column">
      <!--Header -->
      <DashboardHeader />
      <!--Cards-->
      <v-row> </v-row>
      <!--Charts-->
      <v-row> </v-row>
      <!--Position table-->
      <v-row> </v-row>
    </v-container>
  </DashboardLayout>
</template>
