import axios from "axios";
import { io } from "socket.io-client";
import config from "../config/config";

const http = axios.create({
  baseURL: config.hostBaseApiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

const socket = io(config.hostBaseApiUrl);

export const fetchUsdToThbFromAPI = async (interval: string) => {
  const res = await http.get(`/api/usd-to-thb?interval=${interval}`);
  return res.data;
};

export const onNewUsdToThbData = (callback: () => void) => {
  socket.on("new_usd_to_thb_data", callback);
};
