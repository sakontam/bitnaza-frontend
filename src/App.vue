<script setup lang="ts">
import { ref } from "vue";
import bitcoinView from "./components/bitcoinView.vue";
import UsdThbView from "./components/usd_thbView.vue";
import Header from "./components/Header/header.vue";

const selectedGraph = ref<string>("bitcoin");
const isDropdownOpen = ref<boolean>(false);

const options = [
  {
    value: "bitcoin",
    label: "Bitcoin",
    icon: ["fab", "bitcoin"],
  },
  {
    value: "usd_thb",
    label: "USD to THB",
    icon: ["fas", "dollar-sign"],
  },
];
const loading = ref(true);

const handleLoaded = () => {
  loading.value = false;
};

// ตัวแปรเก็บตัวเลือกที่เลือกปัจจุบัน
const selectedOption = ref(options[0]);

// ฟังก์ชันเปิด/ปิด dropdown
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// ฟังก์ชันเลือกตัวเลือก
const selectOption = (option: any) => {
  selectedGraph.value = option.value;
  selectedOption.value = option;
  isDropdownOpen.value = false;
};
</script>

<template>
  <Header />
  <div class="dashboard">
    <div class="navigation">
      <!-- Navigation -->
      <div class="dropdown">
        <div class="dropdown-selected" @click="toggleDropdown">
          <font-awesome-icon
            :icon="selectedOption.icon"
            class="dropdown-icon"
          />
          <span>{{ selectedOption.label }}</span>
        </div>
        <ul v-show="isDropdownOpen" class="dropdown-list">
          <li
            v-for="option in options"
            :key="option.value"
            @click="selectOption(option)"
            class="dropdown-item"
          >
            <font-awesome-icon :icon="option.icon" class="dropdown-icon" />
            <span>{{ option.label }}</span>
          </li>
        </ul>
      </div>
    </div>
    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <span>Loading...</span>
      <span>กำลังเปิดเซิฟเวอร์หลังบ้านกรุณารอสักครู่</span>
    </div>

    <!-- Graph content -->
    <div class="chart-container">
      <div v-if="selectedGraph === 'bitcoin'">
        <bitcoinView :onLoaded="handleLoaded" />
      </div>
      <div v-else-if="selectedGraph === 'usd_thb'">
        <UsdThbView />
      </div>
    </div>
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
  /* background-image: url('assets/stonk.jpg'); 
  background-size: cover;  */
}

.navigation {
  position: absolute;
  top: 84px; /* ขยับลงมาให้พ้น header ที่สูง 64px + margin */
  left: 20px;
  z-index: 200;
}

.dropdown {
  position: relative;
  width: 200px;
  cursor: pointer;
}

.dropdown-selected {
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
}

.dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  list-style: none;
  margin: 0;
  padding: 0;
  z-index: 300; /* ให้ dropdown อยู่เหนือ header */
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 10px;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
  cursor: pointer;
}

.dropdown-icon {
  margin-right: 10px;
  font-size: 20px;
}

.chart-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.chart-container > div {
  width: 100%;
  height: 100%;
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
