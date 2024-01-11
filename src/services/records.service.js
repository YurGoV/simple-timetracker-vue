//records.service.js
import axios from "@/services/axios";

export const saveRecord = async (record) => {
  // console.log(credential, 'credential')
  const response = await axios.post(
    "http://localhost:4000/api/records/create",
    record,
  );

  return response.data;
};

