<script setup lang="ts">
import axios from "axios";
import { Chart, registerables } from "chart.js";
import "chartjs-adapter-date-fns";
import zoomPlugin from "chartjs-plugin-zoom";
import { ref, watch, onMounted } from "vue";
import { io } from "socket.io-client";

// ลงทะเบียน Chart.js และปลั๊กอินที่เกี่ยวข้อง
Chart.register(...registerables, zoomPlugin);

// ตัวแปร state
const bitcoinData = ref<any[]>([]);
const dailyStatistics = ref<{
  high_24h: number;
  low_24h: number;
  latest_price: number;
} | null>(null);
let bitcoinChart: Chart | null = null;
const socket = io("http://localhost:5000"); // เชื่อมต่อกับ WebSocket Server
const selectedInterval = ref<string>("15m"); // ค่าเริ่มต้นช่วงเวลา

// เก็บราคาล่าสุดที่เคยอัพเดทไว้เพื่อใช้เปรียบเทียบ
const previousStatistics = ref<{
  high_24h: number | null;
  low_24h: number | null;
  latest_price: number | null;
}>({
  high_24h: null,
  low_24h: null,
  latest_price: null,
});

// ตัวแปรสำหรับจัดการคลาสของสีราคา
const highPriceClass = ref<string>("price-neutral");
const lowPriceClass = ref<string>("price-neutral");
const latestPriceClass = ref<string>("price-neutral");

// ตัวแปรสำหรับจัดการลูกศรแสดงทิศทาง
const highArrow = ref<string>("");
const lowArrow = ref<string>("");
const latestArrow = ref<string>("");

// ฟังก์ชันดึงข้อมูล
const fetchBitcoinData = async () => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/bitcoin?interval=${selectedInterval.value}`
    );

    if (response.status === 200 && response.data) {
      // อัปเดตข้อมูลราคา
      bitcoinData.value = response.data.prices.map((item: any) => ({
        x: new Date(item.timestamp),
        y: item.price,
      }));

      // อัปเดตราคาสูงสุดและต่ำสุด
      dailyStatistics.value = {
        high_24h: response.data.high_24h,
        low_24h: response.data.low_24h,
        latest_price: response.data.latest_price,
      };

      // อัปเดตกราฟ
      updateBitcoinChart();
    }
  } catch (error: any) {
    console.error("Error fetching Bitcoin data:", error);
  }
};

// ฟังก์ชันอัปเดตกราฟ
const updateBitcoinChart = () => {
  const ctx = document.getElementById("bitcoin-chart") as HTMLCanvasElement;
  if (!ctx) {
    console.error("Canvas element not found.");
    return;
  }

  if (bitcoinChart) {
    bitcoinChart.destroy();
  }

  bitcoinChart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: `Bitcoin Price (${selectedInterval.value})`,
          data: bitcoinData.value,
          borderColor: "#FF9900",
          borderWidth: 2,
          fill: false,
          backgroundColor: "rgba(255, 215, 0, 0.2)",
          pointRadius: 4,
          pointBackgroundColor: "#FFD700",
          pointBorderColor: "#3366CC",
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
            displayFormats: {
              minute: "HH:mm",
            },
          },
          min:
            bitcoinData.value.length > 0
              ? bitcoinData.value[bitcoinData.value.length - 50]?.x
              : null,
          max:
            bitcoinData.value.length > 0
              ? bitcoinData.value[bitcoinData.value.length - 0]?.x
              : null,
        },
      },
      plugins: {
        zoom: {
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: "x", // กำหนดให้ซูมเฉพาะแกน x เท่านั้น
          },
          pan: {
            enabled: true,
            mode: "x", // กำหนดให้เลื่อนได้เฉพาะแกน x เท่านั้น
          },
        },
      },
    },
  });
};

// Lifecycle hooks
onMounted(() => {
  fetchBitcoinData();

  // ฟังเหตุการณ์จาก WebSocket
  socket.on("new_data", () => {
    console.log("New data received from server");
    fetchBitcoinData();
  });
});

// Watcher สำหรับเปลี่ยนช่วงเวลา
watch(selectedInterval, fetchBitcoinData);

// Watchers สำหรับอัพเดตสีของราคาสูงสุด/ต่ำสุด/ล่าสุดและลูกศร
watch(
  () => dailyStatistics.value?.high_24h,
  (newHigh, oldHigh) => {
    if (oldHigh !== undefined && newHigh !== undefined) {
      if (newHigh > oldHigh) {
        highPriceClass.value = "price-up";
        highArrow.value = "▲";
      } else if (newHigh < oldHigh) {
        highPriceClass.value = "price-down";
        highArrow.value = "▼";
      } else {
        highPriceClass.value = "price-neutral";
        highArrow.value = "";
      }
    }
  }
);

watch(
  () => dailyStatistics.value?.low_24h,
  (newLow, oldLow) => {
    if (oldLow !== undefined && newLow !== undefined) {
      if (newLow > oldLow) {
        lowPriceClass.value = "price-up";
        lowArrow.value = "▲";
      } else if (newLow < oldLow) {
        lowPriceClass.value = "price-down";
        lowArrow.value = "▼";
      } else {
        lowPriceClass.value = "price-neutral";
        lowArrow.value = "";
      }
    }
  }
);

watch(
  () => dailyStatistics.value?.latest_price,
  (newLatest, oldLatest) => {
    if (oldLatest !== undefined && newLatest !== undefined) {
      if (newLatest > oldLatest) {
        latestPriceClass.value = "price-up";
        latestArrow.value = "▲";
      } else if (newLatest < oldLatest) {
        latestPriceClass.value = "price-down";
        latestArrow.value = "▼";
      } else {
        latestPriceClass.value = "price-neutral";
        latestArrow.value = "";
      }
    }
  }
);
</script>

<template>
  <div class="chart-container">
    <div class="interval-buttons">
      <button
        v-for="interval in ['1m', '5m', '15m', '30m', '1h', '4h', '1d']"
        :key="interval"
        :class="{ active: selectedInterval === interval }"
        @click="selectedInterval = interval"
      >
        {{ interval }}
      </button>
    </div>
    <h2>ราคา Bitcoin</h2>
    <canvas id="bitcoin-chart"></canvas>
    <div class="price-container">
      <h2>ราคาสูงสุด 24 h</h2>
      <h2 :class="highPriceClass">
        {{ dailyStatistics?.high_24h?.toFixed(2) || "กำลังโหลด..." }}
        {{ highArrow }}
      </h2>
      <h2>ราคาต่ำสุด 24 h</h2>
      <h2 :class="lowPriceClass">
        {{ dailyStatistics?.low_24h?.toFixed(2) || "กำลังโหลด..." }}
        {{ lowArrow }}
      </h2>
      <h2>ราคาล่าสุด</h2>
      <h2 :class="latestPriceClass">
        {{ dailyStatistics?.latest_price?.toFixed(2) || "กำลังโหลด..." }}
        {{ latestArrow }}
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
