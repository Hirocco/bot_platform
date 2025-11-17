<template>
  <LoginLayout>
    <v-container fluid class="fill-height pa-0">
      <v-row class="fill-height" no-gutters>
        <!-- LEWA KOLUMNA – FORM WYPEŁNIA TŁO -->
        <v-col cols="12" md="4" class="h-100 align-center justify-center">
          <v-sheet class="login-left h-100" elevation="8">
            <v-container class="h-100 d-flex align-center justify-center">
              <div class="left-content">
                <div class="logo-wrapper">
                  <img src="@/assets/tfx-logo-removebg.png" alt="TFX Logo" class="logo" />
                </div>
                <LoginForm />
              </div>
            </v-container>
          </v-sheet>
        </v-col>

        <!-- PRAWA KOLUMNA – HERO, WYŚRODKOWANA WZGLĘDEM CAŁEJ KOLUMNY -->
        <v-col cols="12" md="8" class="h-100">
          <v-sheet class="login-right h-100" elevation="0">
            <!-- animowane tło -->
            <div class="hero-bg"></div>

            <!-- WRAPPER FLEX NA CAŁĄ WYSOKOŚĆ KOLUMNY -->
            <div class="hero-wrapper d-flex align-center justify-center h-100">
              <v-container class="hero-content text-center">
                <div class="hero-heading mb-6">
                  <div class="text-h4 mb-3">Integrate VWAP strategy to your CFD trading today!</div>
                  <div class="hero-subtitle">
                    Execute trades with institutional logic, dynamic VWAP targeting and robust risk
                    management directly on your MT5 account.
                  </div>
                </div>

                <!-- CTA -->
                <div class="hero-cta mb-10">
                  <v-btn color="primary" size="large" class="mr-3"> Start demo </v-btn>
                  <v-btn variant="outlined" size="large"> View strategy docs </v-btn>
                </div>

                <!-- CHMURKI – WYŚRODKOWANE -->
                <v-row dense class="stat-row justify-center">
                  <v-col cols="12" md="4">
                    <v-card class="stat-card">
                      <v-card-text>
                        <div class="text-caption mb-1">Trusted by</div>
                        <div class="text-h6">X users</div>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-card class="stat-card">
                      <v-card-text>
                        <div class="text-caption mb-1">Annual Return</div>
                        <div class="text-h6">40%</div>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-card class="stat-card">
                      <v-card-text>
                        <div class="text-caption mb-1">Easy integration</div>
                        <div class="text-body-2">Trusted by X brokers</div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>

                <div class="hero-footnote mt-6 text-caption">
                  * Backtest results are hypothetical. Trading CFDs involves risk.
                </div>
              </v-container>
            </div>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </LoginLayout>
</template>

<script setup lang="ts">
import LoginLayout from '@/layouts/LoginLayout.vue'
import LoginForm from '@/components/LoginForm.vue'
</script>

<style scoped>
/* LEWA STRONA */
.login-left {
  background:
    linear-gradient(180deg, #050d18, #081b2f),
    repeating-linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.04) 0px,
      rgba(255, 255, 255, 0.04) 1px,
      transparent 1px,
      transparent 24px
    ),
    repeating-linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.04) 0px,
      rgba(255, 255, 255, 0.04) 1px,
      transparent 1px,
      transparent 24px
    );
}

/* PRAWA STRONA */
.login-right {
  position: relative;
  overflow: hidden;
}

/* animowane tło */
.hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 0% 10%, #2f7fff, transparent 55%),
    radial-gradient(circle at 80% 100%, #26e4b9, transparent 55%),
    linear-gradient(140deg, #041427, #063243);
  background-size: 200% 200%;
  animation: hero-move 18s ease-in-out infinite alternate;
  opacity: 0.55;
}

/* wrapper flex – CENTRUM PRAWEJ KOLUMNY */
.hero-wrapper {
  position: relative;
  z-index: 5;
}

/* sama treść – ograniczona szerokość, bez dodatkowego flexa */
.hero-content {
  max-width: 960px;
}

/* opis */
.hero-subtitle {
  max-width: 600px;
  margin: 0 auto;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  line-height: 1.6;
}

/* chmurki */
.stat-row {
  max-width: 900px;
  margin: 0 auto;
}

.stat-card {
  background: rgba(4, 13, 26, 0.92);
  min-height: 100%;
  border-radius: 14px;
  border: 1px solid rgba(134, 214, 255, 0.7);
  box-shadow:
    0 0 12px rgba(134, 214, 255, 0.25),
    0 12px 25px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(6px);
  animation: float 7s ease-in-out infinite;
}

.stat-row > .v-col:nth-of-type(2) .stat-card {
  animation-delay: 0.8s;
}
.stat-row > .v-col:nth-of-type(3) .stat-card {
  animation-delay: 1.6s;
}

/* pływanie */
@keyframes float {
  0% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-6px) translateX(3px);
  }
  100% {
    transform: translateY(0) translateX(0);
  }
}

/* animacja tła */
@keyframes hero-move {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 50% 0%;
  }
}
.logo-wrapper {
  margin-top: -15vh;
  width: 100%;
  display: flex;
  justify-content: center;
  transform: translateY(-5%);
}

.logo {
  width: 300px;
  height: auto;
  filter: brightness(0.92) saturate(0.8);
}
</style>
