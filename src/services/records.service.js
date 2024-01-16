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


export const updateRecord = async (record) => {
  // console.log(credential, 'credential')
  const response = await axios.patch(
    "http://localhost:4000/api/records/update",
    record,
  );

  return response.data;
};
