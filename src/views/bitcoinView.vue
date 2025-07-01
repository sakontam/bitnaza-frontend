<script setup lang="ts">
import { Chart, registerables } from "chart.js";
import "chartjs-adapter-date-fns";
import zoomPlugin from "chartjs-plugin-zoom";
import { onMounted, watch } from "vue";
import { useBitcoinStore } from "../stores/bitcoinStore";
import { useRouter } from "vue-router";

Chart.register(...registerables, zoomPlugin);

const store = useBitcoinStore();
let bitcoinChart: Chart | null = null;
const router = useRouter();
const props = defineProps<{ onLoaded: () => void }>();
const goBackHome = () => {
  router.push("/");
};
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
  await store.fetchBitcoinData();
  updateBitcoinChart();
  props.onLoaded();
});

watch(
  () => store.bitcoinData,
  () => {
    updateBitcoinChart();
    props.onLoaded();
  }
);
</script>

<template>
  <div class="chart-container">
    <button class="back-button" @click="goBackHome">กลับหน้าแรก</button>
    <div class="interval-buttons">
      <button
        v-for="interval in ['1m', '5m', '15m', '30m', '1h', '4h', '1d']"
        :key="interval"
        :class="{ active: store.selectedInterval === interval }"
        @click="
          () => {
            store.selectedInterval = interval;
          }
        "
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
  padding-top: 80px;
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

.back-button {
  align-self: flex-start;
  margin-left: 32px;
  margin-bottom: 20px;
  padding: 10px 18px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background-color: #f7931a;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.back-button:hover {
  background-color: #e07e0f;
  transform: translateY(-1px);
}

.back-button:active {
  transform: translateY(1px);
  box-shadow: none;
}
</style>
