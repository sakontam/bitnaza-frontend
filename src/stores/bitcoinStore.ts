// stores/bitcoinStore.ts
import { defineStore } from "pinia";
import { ref, watch } from "vue";
import axios from "axios";
import { io } from "socket.io-client";

export const useBitcoinStore = defineStore("bitcoin", () => {
  const bitcoinData = ref<any[]>([]);
  const dailyStatistics = ref<{
    high_24h: number;
    low_24h: number;
    latest_price: number;
  } | null>(null);

  const selectedInterval = ref("15m");
  const socket = io("http://localhost:5000");

  const previousStatistics = ref<{
    high_24h: number | null;
    low_24h: number | null;
    latest_price: number | null;
  }>({
    high_24h: null,
    low_24h: null,
    latest_price: null,
  });

  const highPriceClass = ref("price-neutral");
  const lowPriceClass = ref("price-neutral");
  const latestPriceClass = ref("price-neutral");

  const highArrow = ref("");
  const lowArrow = ref("");
  const latestArrow = ref("");

  const fetchBitcoinData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/bitcoin?interval=${selectedInterval.value}`
      );
      if (res.status === 200 && res.data) {
        bitcoinData.value = res.data.prices.map((item: any) => ({
          x: new Date(item.timestamp),
          y: item.price,
        }));
        previousStatistics.value = dailyStatistics.value ?? {
          high_24h: null,
          low_24h: null,
          latest_price: null,
        };
        dailyStatistics.value = {
          high_24h: res.data.high_24h,
          low_24h: res.data.low_24h,
          latest_price: res.data.latest_price,
        };
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  socket.on("new_data", () => {
    fetchBitcoinData();
  });

  watch(selectedInterval, fetchBitcoinData);

  watch(
    () => dailyStatistics.value?.high_24h,
    (newVal) => {
      const oldVal = previousStatistics.value.high_24h;
      if (oldVal !== null && newVal !== undefined) {
        highPriceClass.value = newVal > oldVal ? "price-up" : newVal < oldVal ? "price-down" : "price-neutral";
        highArrow.value = newVal > oldVal ? "▲" : newVal < oldVal ? "▼" : "";
      }
    }
  );

  watch(
    () => dailyStatistics.value?.low_24h,
    (newVal) => {
      const oldVal = previousStatistics.value.low_24h;
      if (oldVal !== null && newVal !== undefined) {
        lowPriceClass.value = newVal > oldVal ? "price-up" : newVal < oldVal ? "price-down" : "price-neutral";
        lowArrow.value = newVal > oldVal ? "▲" : newVal < oldVal ? "▼" : "";
      }
    }
  );

  watch(
    () => dailyStatistics.value?.latest_price,
    (newVal) => {
      const oldVal = previousStatistics.value.latest_price;
      if (oldVal !== null && newVal !== undefined) {
        latestPriceClass.value = newVal > oldVal ? "price-up" : newVal < oldVal ? "price-down" : "price-neutral";
        latestArrow.value = newVal > oldVal ? "▲" : newVal < oldVal ? "▼" : "";
      }
    }
  );

  return {
    bitcoinData,
    dailyStatistics,
    selectedInterval,
    fetchBitcoinData,
    highPriceClass,
    lowPriceClass,
    latestPriceClass,
    highArrow,
    lowArrow,
    latestArrow,
  };
});
