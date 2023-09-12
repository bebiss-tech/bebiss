import axios from "axios";

export const hustAPI = axios.create({
  baseURL: process.env.HUST_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.HUST_API_TOKEN!}`,
  },
});
