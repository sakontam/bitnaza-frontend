<script setup lang="ts">
import { Chart, registerables } from "chart.js";
import "chartjs-adapter-date-fns";
import zoomPlugin from "chartjs-plugin-zoom";
import { onMounted, watch, ref } from "vue";
import { useBitcoinStore } from "../stores/bitcoinStore";

Chart.register(...registerables, zoomPlugin);

const store = useBitcoinStore();
let bitcoinChart: Chart | null = null;

const loading = ref(true);

const updateBitcoinChart = () => {
  const ctx = document.getElementById("bitcoin-chart") as HTMLCanvasElement;
  if (!ctx) return;

  if (bitcoinChart) bitcoinChart.destroy();

  bitcoinChart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: `Bitcoin Price (${store.selectedInterval})`,
          data: store.bitcoinData,
          borderWidth: 2,
          fill: false,
          pointRadius: 4,
          pointBackgroundColor: "#FFD700",
          pointBorderColor: "#3366CC",
          segment: {
            borderColor: (ctx) => {
              if (!ctx.p0 || !ctx.p1) return "gray";
              return ctx.p1.y > ctx.p0.y ? "red" : "green";
            },
          },
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "time",
          time: {
            unit: "minute",
            displayFormats: { minute: "HH:mm" },
          },
          min: store.bitcoinData.at(-50)?.x ?? null,
          max: store.bitcoinData.at(-1)?.x ?? null,
        },
      },
      plugins: {
        zoom: {
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true },
            mode: "x",
          },
          pan: {
            enabled: true,
            mode: "x",
          },
        },
      },
    },
  });
};

onMounted(async () => {
  loading.value = true;
  await store.fetchBitcoinData();
  updateBitcoinChart();
  loading.value = false;
});

watch(() => store.bitcoinData, () => {
  updateBitcoinChart();
  loading.value = false;
});
</script>

<template>
  <div class="chart-container">
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <span>Loading...</span>
    </div>
    <div class="interval-buttons">
      <button
        v-for="interval in ['1m', '5m', '15m', '30m', '1h', '4h', '1d']"
        :key="interval"
        :class="{ active: store.selectedInterval === interval }"
        @click="() => { store.selectedInterval = interval; loading = true; }"
      >
        {{ interval }}
      </button>
    </div>
    <h2>ราคา Bitcoin</h2>
    <canvas id="bitcoin-chart"></canvas>
    <div class="price-container">
      <h2>ราคาสูงสุด 24 h</h2>
      <h2 :class="store.highPriceClass">
        {{ store.dailyStatistics?.high_24h?.toFixed(2) || "กำลังโหลด..." }}
        {{ store.highArrow }}
      </h2>
      <h2>ราคาต่ำสุด 24 h</h2>
      <h2 :class="store.lowPriceClass">
        {{ store.dailyStatistics?.low_24h?.toFixed(2) || "กำลังโหลด..." }}
        {{ store.lowArrow }}
      </h2>
      <h2>ราคาล่าสุด</h2>
      <h2 :class="store.latestPriceClass">
        {{ store.dailyStatistics?.latest_price?.toFixed(2) || "กำลังโหลด..." }}
        {{ store.latestArrow }}
      </h2>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}
.spinner {
  border: 6px solid #f3f3f3;
  border-top: 6px solid #f7931a;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.price-container {
  position: absolute;
  top: 10%;
  margin-left: 1250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: auto;
  padding: 10px;
  text-align: center;
}

.interval-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.interval-buttons button {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #f0f0f0;
  color: #000;
  font-weight: bold;
}

.interval-buttons button.active {
  background-color: #4caf50;
  color: #fff;
}

canvas {
  width: 100%;
  max-width: 1000px;
  height: 100%;
  max-height: 500px;
}

.price-up {
  color: green;
}

.price-down {
  color: red;
}

.price-neutral {
  color: black;
}
</style>
