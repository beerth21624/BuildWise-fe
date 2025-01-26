import axios from "axios";

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_BASE_API;
};

const axiosAPI = axios.create({
  baseURL: getBaseUrl(),
});

export { axiosAPI, getBaseUrl };
