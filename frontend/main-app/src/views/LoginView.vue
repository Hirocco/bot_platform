<template>
  <div class="login-container">
    <div class="login-card">
      <h1>MT5 Login</h1>

      <form @submit.prevent="handleLogin">
        <input v-model="login" placeholder="Login" required />
        <input v-model="password" type="password" placeholder="Hasło" required />
        <input v-model="server" placeholder="Serwer" required />
        <button type="submit">Zaloguj</button>
      </form>

      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

const login = ref('')
const password = ref('')
const server = ref('')
const error = ref(null)

async function handleLogin() {
  error.value = null

  try {
    const response = await axios.post(
      'http://localhost:8000/mt5/login',
      {
        login: login.value,
        password: password.value,
        server: server.value,
      },
      {
        headers: {
          'X-Correlation-Id': uuidv4(),
          'Idempotency-Key': uuidv4(),
        },
      }
    )

    console.log('Zalogowano:', response.data)
    // TODO: przekierowanie do dashboardu
  } catch (err) {
    error.value = 'Nie udało się zalogować do MT5.'
    console.error(err)
  }
}
</script>

<style scoped>
/* Tło całej strony */
.login-container {
  background-color: #121212;
  color: #e0e0e0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Karta logowania */
.login-card {
  background-color: #1e1e1e;
  border-radius: 12px;
  padding: 2rem 2.5rem;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  width: 320px;
  text-align: center;
}

/* Nagłówek */
h1 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: #ffffff;
}

/* Pola formularza */
input {
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  background-color: #2c2c2c;
  color: #ffffff;
  font-size: 1rem;
}

input:focus {
  outline: 2px solid #42a5f5;
}

/* Przycisk */
button {
  width: 100%;
  background-color: #42a5f5;
  border: none;
  border-radius: 8px;
  padding: 0.75rem;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #1e88e5;
}

/* Błąd logowania */
.error {
  color: #ef5350;
  margin-top: 1rem;
  font-size: 0.9rem;
}
</style>
