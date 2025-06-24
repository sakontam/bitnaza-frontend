<script setup lang="ts">
import { Chart } from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-date-fns";
import { onMounted, onBeforeUnmount, watch } from "vue";
import { useUsdToThbStore } from "../stores/usdToThbStore";

Chart.register(zoomPlugin);
const store = useUsdToThbStore();

let usdToThbChart: Chart | null = null;

const updateUsdToThbChart = () => {
  const ctx = document.getElementById("usd-to-thb-chart") as HTMLCanvasElement;
  if (!ctx) return;

  if (usdToThbChart) usdToThbChart.destroy();

  usdToThbChart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: `USD to THB Exchange Rate (${store.selectedInterval})`,
          data: store.usdToThbData,
          borderColor: "#33CC99",
          borderWidth: 2,
          fill: false,
          backgroundColor: "rgba(255, 215, 0, 0.2)",
          pointRadius: 4,
          pointBackgroundColor: "#33CC99",
          pointBorderColor: "#FF00FF",
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
          min: store.usdToThbData.at(-50)?.x ?? null,
          max: store.usdToThbData.at(-1)?.x ?? null,
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
  await store.fetchUsdToThbData();
  updateUsdToThbChart();
});

watch(() => store.usdToThbData, updateUsdToThbChart);

onBeforeUnmount(() => {
  if (usdToThbChart) usdToThbChart.destroy();
});
</script>

<template>
  <div class="chart-container">
    <!-- ปุ่มเลือกช่วงเวลา -->
    <div class="interval-buttons">
      <button
        v-for="interval in ['1m', '5m', '15m', '30m', '1h', '4h', '1d']"
        :key="interval"
        :class="{ active: store.selectedInterval === interval }"
        @click="store.selectedInterval = interval"
      >
        {{ interval }}
      </button>
    </div>

    <h2>อัตราแลกเปลี่ยน USD to THB</h2>
    <canvas id="usd-to-thb-chart"></canvas>

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
