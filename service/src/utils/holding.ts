import axios from "axios";

const apiFetch = axios.create({
  baseURL:
    "https://merchant-verification-test-a6dba7hrezffecdw.southeastasia-01.azurewebsites.net/api",
});

export const loginToHolding = async () => {
  const { data } = await apiFetch.post("/login");

  return data.auth_token;
};
