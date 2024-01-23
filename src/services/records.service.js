import axios from "@/services/axios";
const baseUrl = import.meta.env.VITE_BACK_BASE_URL;

export const saveRecord = async (record) => {
  const response = await axios.post(
    `${baseUrl}/records/create`,
    record,
  );

  return response.data;
};


export const updateRecord = async (record) => {
  const response = await axios.patch(
    `${baseUrl}/records/update`,
    record,
  );

  return response.data;
};
