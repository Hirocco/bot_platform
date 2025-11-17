<template>
  <div class="login-form-card">
    <div class="title mb-4">Log in with your MT5 credentials</div>

    <v-form @submit.prevent="submit" v-model="valid" class="form">
      <v-text-field
        label="Server"
        v-model="server"
        variant="outlined"
        density="comfortable"
        class="mb-3"
        hide-details
        placeholder="ICMarketsSC-Demo"
      />
      <v-text-field
        label="Login"
        v-model="login"
        variant="outlined"
        density="comfortable"
        class="mb-3"
        hide-details
        placeholder="12345678"
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

      <v-btn block @click="submit" class="submit-btn" size="large">
        <span>Integrate platform with MT5</span>
      </v-btn>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AuthApi, type LoginDTO } from '@/api/AuthApi'
import { useRouter } from 'vue-router'

const router = useRouter()

const server = ref('')
const login = ref('')
const password = ref('')

const valid = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

async function submit() {
  error.value = null
  loading.value = true

  const payload: LoginDTO = {
    server: server.value,
    login: login.value,
    password: password.value,
  }

  try {
    const response = await AuthApi.login(payload)
    await router.push('dashboard')
    console.log('Login success: ', response.data)
  } catch (err: unknown) {
    console.error('Login error:', err)
    type AxiosLikeError = { response?: { data?: { detail?: string } } }
    if (err && typeof err === 'object' && 'response' in err) {
      const axiosErr = err as AxiosLikeError
      error.value = axiosErr.response?.data?.detail ?? 'Failed to login'
    } else {
      error.value = 'Failed to login'
    }
  }
  loading.value = false
}
</script>

<style scoped>
.login-form-card {
  padding: 24px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(6px);

  /* animowana poświata */
  position: relative;
  overflow: hidden;
}

.login-form-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  padding: 2px;
  background: linear-gradient(
    130deg,
    rgba(0, 153, 255, 0.6),
    rgba(0, 255, 195, 0.45),
    rgba(0, 153, 255, 0.6)
  );
  background-size: 200% 200%;
  animation: borderGlow 6s ease infinite;
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

@keyframes borderGlow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.title {
  font-size: 1.2rem;
  font-weight: 500;
}

.submit-btn {
  background: linear-gradient(135deg, #1f6feb, #20c6b7);
  color: white !important;
  font-weight: 600;
  border-radius: 10px;
  text-transform: none;
  letter-spacing: 0.04em;
  transition: box-shadow 0.25s;
}

.submit-btn:hover {
  box-shadow:
    0 0 15px rgba(46, 180, 252, 0.55),
    0 0 25px rgba(32, 198, 183, 0.35);
}
</style>
