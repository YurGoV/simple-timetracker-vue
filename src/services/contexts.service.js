//records.service.js
import axios from "@/services/axios";
const baseUrl = import.meta.env.VITE_BACK_BASE_URL;

export const updateContext = async (payload) => {
  // console.log(credential, 'credential')

  const response = await axios.patch(
    `${baseUrl}/contexts`,
    payload,
  );

  return response.data;
};
