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

export const fetchBitcoinDataFromAPI = async (interval: string) => {
  const res = await http.get(`/api/bitcoin?interval=${interval}`);
  return res.data;
};

export const onNewBitcoinData = (callback: () => void) => {
  socket.on("new_data", callback);
};
