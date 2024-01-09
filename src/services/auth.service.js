//auth.service.js
import axios from "@/services/axios";

export const loginUserByCredential = async ({ credential }) => {
  // console.log(credential, 'credential')
  const user = await axios.post("http://localhost:4000/api/auth/login", {
    credential,
  });

  axios.defaults.headers.common["Authorization"] = `Bearer ${user.data.token}`;

  const gettedRecords = await axios.get("http://localhost:4000/api/records");

  const gettedContexts = await axios.get("http://localhost:4000/api/contexts");

  return {
    user: user.data,
    gettedRecords: gettedRecords.data,
    gettedContexts: gettedContexts.data,
  };
};

export const logoutUser = async () => {
  const response = await axios.post(
    "http://localhost:4000/api/auth/logout",
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

  const gettedRecords = await axios.get("http://localhost:4000/api/records");

  const gettedContexts = await axios.get("http://localhost:4000/api/contexts");

  return {
    user: user.data,
    gettedRecords: gettedRecords.data,
    gettedContexts: gettedContexts.data,
  };
};

// export default login;
