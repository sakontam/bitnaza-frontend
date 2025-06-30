import { defineStore } from "pinia";
import { ref, watch } from "vue";
import {
  fetchUsdToThbFromAPI,
  onNewUsdToThbData,
} from "../services/usdToThbService";

export const useUsdToThbStore = defineStore("usdToThb", () => {
  const usdToThbData = ref<any[]>([]);
  const dailyStatistics = ref<{
    high_24h: number;
    low_24h: number;
    latest_price: number;
  } | null>(null);

  const selectedInterval = ref("15m");

  const highPriceClass = ref("price-neutral");
  const lowPriceClass = ref("price-neutral");
  const latestPriceClass = ref("price-neutral");

  const highArrow = ref("");
  const lowArrow = ref("");
  const latestArrow = ref("");

  const previousStatistics = ref<{
    high_24h: number | null;
    low_24h: number | null;
    latest_price: number | null;
  }>({
    high_24h: null,
    low_24h: null,
    latest_price: null,
  });

  const fetchUsdToThbData = async () => {
    try {
      const data = await fetchUsdToThbFromAPI(selectedInterval.value);

      usdToThbData.value = data.prices.map((item: any) => ({
        x: new Date(item.timestamp),
        y: item.price,
      }));

      previousStatistics.value = dailyStatistics.value ?? {
        high_24h: null,
        low_24h: null,
        latest_price: null,
      };

      dailyStatistics.value = {
        high_24h: parseFloat(data.high_24h.toFixed(2)),
        low_24h: parseFloat(data.low_24h.toFixed(2)),
        latest_price: parseFloat(data.latest_price.toFixed(2)),
      };
    } catch (err) {
      console.error("Fetch USD/THB error:", err);
    }
  };

  onNewUsdToThbData(() => {
    fetchUsdToThbData();
  });

  watch(selectedInterval, fetchUsdToThbData);

  watch(
    () => dailyStatistics.value?.high_24h,
    (newVal) => {
      const oldVal = previousStatistics.value.high_24h;
      if (oldVal !== null && newVal !== undefined) {
        highPriceClass.value =
          newVal > oldVal
            ? "price-up"
            : newVal < oldVal
            ? "price-down"
            : "price-neutral";
        highArrow.value = newVal > oldVal ? "▲" : newVal < oldVal ? "▼" : "";
      }
    }
  );

  watch(
    () => dailyStatistics.value?.low_24h,
    (newVal) => {
      const oldVal = previousStatistics.value.low_24h;
      if (oldVal !== null && newVal !== undefined) {
        lowPriceClass.value =
          newVal > oldVal
            ? "price-up"
            : newVal < oldVal
            ? "price-down"
            : "price-neutral";
        lowArrow.value = newVal > oldVal ? "▲" : newVal < oldVal ? "▼" : "";
      }
    }
  );

  watch(
    () => dailyStatistics.value?.latest_price,
    (newVal) => {
      const oldVal = previousStatistics.value.latest_price;
      if (oldVal !== null && newVal !== undefined) {
        latestPriceClass.value =
          newVal > oldVal
            ? "price-up"
            : newVal < oldVal
            ? "price-down"
            : "price-neutral";
        latestArrow.value = newVal > oldVal ? "▲" : newVal < oldVal ? "▼" : "";
      }
    }
  );

  return {
    usdToThbData,
    dailyStatistics,
    selectedInterval,
    fetchUsdToThbData,
    highPriceClass,
    lowPriceClass,
    latestPriceClass,
    highArrow,
    lowArrow,
    latestArrow,
  };
});
