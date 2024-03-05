import axios from "@/services/axios";
const baseUrl = import.meta.env.VITE_BACK_BASE_URL;

export const saveRecord = async (record) => {
  try {
    const response = await axios.post(`${baseUrl}/records/create`, record);

    return response.data;
  } catch {
    return false;
  }
};

export const updateRecord = async (record) => {
  try {
    const response = await axios.patch(`${baseUrl}/records/update`, record);

    return response.data;
  } catch {
    return false;
  }
};

export const deleteRecord = async (id) => {
  try {
    await axios.delete(`${baseUrl}/records/${id}`);
    return true;
  } catch {
    return false;
  }
};
