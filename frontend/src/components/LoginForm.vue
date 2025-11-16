<template>
  <div class="login-form-wrapper">
    <div class="title mb-4">Log in with your MT5 credentials</div>

    <v-form v-model="valid" class="form">
      <v-text-field
        label="Server"
        v-model="server"
        variant="outlined"
        density="comfortable"
        class="mb-3"
        hide-details
      />
      <v-text-field
        label="Login"
        v-model="login"
        variant="outlined"
        density="comfortable"
        class="mb-3"
        hide-details
      />
      <v-text-field
        label="Password"
        v-model="password"
        type="password"
        variant="outlined"
        density="comfortable"
        class="mb-6"
        hide-details
      />

      <v-btn block @click="submit" variant="text" class="submit-btn">
        INTEGRATE PLATFORM WITH MT5
      </v-btn>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const server = ref('')
const login = ref('')
const password = ref('')
const valid = ref(false)

function submit() {
  console.log({ server: server.value, login: login.value, password: password.value })
}
</script>

<style scoped>
.login-form-wrapper {
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  color: white;
}

.title {
  font-size: 1.2rem;
  font-weight: 500;
}

.submit-btn {
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.8);
}
</style>
