//auth.service.js
import axios from "@/services/axios";
const baseUrl = import.meta.env.VITE_BACK_BASE_URL;

export const loginUserByCredential = async ({ credential }) => {
  // console.log(credential, 'credential')
  const user = await axios.post(`${baseUrl}/auth/login`, {
    credential,
  });

  axios.defaults.headers.common["Authorization"] = `Bearer ${user.data.token}`;

  // TODO: move to records.service
  const gettedRecords = await axios.get(`${baseUrl}/records`);

  // TODO: move to context.service
  const gettedContexts = await axios.get(`${baseUrl}/contexts`);

  return {
    user: user.data,
    gettedRecords: gettedRecords.data,
    gettedContexts: gettedContexts.data,
  };
};

export const logoutUser = async () => {
  const response = await axios.post(
    `${baseUrl}/auth/logout`,
    {},
  );

  delete axios.defaults.headers.common["Authorization"];

  return response.data;
};

export const loginUserByToken = async (token) => {
  const user = await axios.get("auth/current", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  axios.defaults.headers.common["Authorization"] = `Bearer ${user.data.token}`;

  const gettedRecords = await axios.get(`${baseUrl}/records`);

  const gettedContexts = await axios.get(`${baseUrl}/contexts`);

  return {
    user: user.data,
    gettedRecords: gettedRecords.data,
    gettedContexts: gettedContexts.data,
  };
};

// export default login;
