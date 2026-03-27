import { AxiosInstance } from "@/api/axios/axios";
import { endPoints } from "@/api/endPoints/endPoints";

export const loginApi = async (data: {
  email: string;
  password: string;
}) => {
  const response = await AxiosInstance.post(endPoints.auth.signIn, data);
  return response.data;
};