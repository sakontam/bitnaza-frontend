<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, onMounted, onUnmounted } from "vue";
import Header from "../components/Header/header.vue";
import { useBitcoinStore } from "../stores/bitcoinStore";
import { useUsdToThbStore } from "../stores/usdToThbStore";

const bitcoinStore = useBitcoinStore();
const usdToThbStore = useUsdToThbStore();
const currentIndex = ref(0);
let intervalId: number | undefined;
const loading = ref(true);
const vueRouter = useRouter();

const images = [
  new URL("../assets/TADC-Untitled18239.png", import.meta.url).href,
  new URL("../assets/Gs8XVJzXIAAI9VD.jpg", import.meta.url).href,
  new URL("../assets/me2-removebg-preview.png", import.meta.url).href,
];

const coinList = [
  {
    name: "Bitcoin",
    get price() {
      return bitcoinStore.dailyStatistics?.latest_price ?? 0;
    },
    icon: new URL("../assets/bitcoin.png", import.meta.url).href,
  },
  {
    name: "USD",
    get price() {
      return usdToThbStore.dailyStatistics?.latest_price ?? 0;
    },
    icon: new URL("../assets/dollar-symbol.png", import.meta.url).href,
  },
];

function goToCoinView(name: string) {
  if (name === "Bitcoin") {
    vueRouter.push("/bitcoin");
  } else if (name === "USD") {
    vueRouter.push("/usd");
  }
}
onMounted(async () => {
  intervalId = window.setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % images.length;
  }, 2500);
  // Fetch latest prices before showing
  await Promise.all([
    bitcoinStore.fetchBitcoinData(),
    usdToThbStore.fetchUsdToThbData(),
  ]);
  setTimeout(() => {
    loading.value = false;
  }, 1500);
});
onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<template>
  <Header />
  <div class="dashboard">
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <span>Loading...</span>
      <span>กำลังเปิดเซิฟเวอร์หลังบ้านกรุณารอสักครู่</span>
    </div>

    <div v-else class="custom-carousel">
      <img :src="images[currentIndex]" alt="carousel" class="carousel-img" />
      <div class="carousel-dots">
        <span
          v-for="(img, idx) in images"
          :key="idx"
          :class="['dot', { active: idx === currentIndex }]"
          @click="currentIndex = idx"
        ></span>
      </div>

      <!-- Coin list section -->
      <div class="coin-table">
        <div class="coin-table-header">
          <span class="coin-left"></span>
          <span class="coin-label">ราคาล่าสุด</span>
          <span class="coin-right"></span>
        </div>

        <div
          class="coin-item"
          v-for="coin in coinList"
          :key="coin.name"
          @click="goToCoinView(coin.name)"
          style="cursor: pointer"
        >
          <div class="coin-info">
            <img :src="coin.icon" alt="icon" class="coin-icon" />
            <span class="coin-name">{{ coin.name }}</span>
          </div>
          <span class="coin-price">{{ coin.price.toLocaleString() }}</span>
          <span class="coin-star">☆</span>
        </div>
      </div>
    </div>
    <footer class="footer">
      <span>เว็บไซต์นี้อยู่ระหว่างการพัฒนา</span>
      <span>© 2025 Sakontam</span>
    </footer>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  height: 100vh;
  box-sizing: border-box;
  padding-top: 80px; /* เพิ่ม padding-top เพื่อเว้นระยะจาก header */
}

.custom-carousel {
  width: 800px;
  height: 210px;
  margin-left: 500px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.carousel-img {
  width: 100%;
  height: 300px;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  background: #fff;
}

.carousel-dots {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ccc;
  margin: 0 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.dot.active {
  background: #f7931a;
}

.coin-table {
  width: 100vw; /* เต็มหน้าจอ */
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
  box-sizing: border-box;
  padding: 0 32px; /* เว้นขอบซ้ายขวา */
}

.coin-table-header {
  display: flex;
  justify-content: space-between;
  padding: 0 32px;
  font-size: 16px;
  color: #333;
  font-weight: bold;
  width: 100%;
  box-sizing: border-box;
}

.coin-label {
  text-align: center;
  flex: 1;
}

.coin-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  padding: 12px 32px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  font-family: "Inter";
  width: 100%;
  box-sizing: border-box;
  margin-left: 50px;
}

.coin-info {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 200px;
}

.coin-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.coin-name {
  font-size: 18px;
  color: #333;
  font-weight: 500;
}

.coin-price {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-right: 280px;
  flex: 1;
  color: #000;
}

.coin-star {
  font-size: 24px;
  color: #333;
  cursor: pointer;
  transition: color 0.2s;
}

.coin-star:hover {
  color: gold;
}

.footer {
  margin-top: auto;
  width: 100%;
  padding: 16px 32px;
  background-color: #f5f5f5;
  color: #555;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #ddd;
  box-sizing: border-box;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 999;
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
