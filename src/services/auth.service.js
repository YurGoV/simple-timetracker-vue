import axios from "axios";

export const loginUser = async ({ credential }) => {
  // console.log(credential, 'credential')
  const response = await axios.post("http://localhost:4000/api/auth/login", {
    credential,
  });

  axios.defaults.headers.common["Authorization"] =
    `Bearer ${response.data.token}`;

  return response.data;
};

export const logoutUser = async () => {
  const response = await axios.post(
    "http://localhost:4000/api/auth/logout",
    {},
  );

  delete axios.defaults.headers.common["Authorization"];

  return response.data;
};

export const getUserByToken = async (token) => {
  // console.log(credential, 'credential')
  const response = await axios.get("http://localhost:4000/api/auth/current", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  axios.defaults.headers.common["Authorization"] =
    `Bearer ${response.data.token}`;

  return response.data;
};

// export default login;
