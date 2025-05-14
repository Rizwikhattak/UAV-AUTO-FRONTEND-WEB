import { axiosFORM, axiosJSON } from "@/utils/Axios";
import { API_ACTIONS, API_TYPE } from "@/utils/constants";
import { toast } from "sonner";

export const API_COMMON = async (
  action,
  type = API_TYPE.JSON,
  api_url,
  data = null
) => {
  try {
    switch (action) {
      case API_ACTIONS.GET: {
        const response = await axiosJSON.get(api_url);
        return response?.data;
      }
      case API_ACTIONS.POST: {
        const response =
          type === API_TYPE.JSON
            ? await axiosJSON.post(api_url, JSON.stringify(data))
            : await axiosFORM.post(api_url, data);
        return response?.data;
      }
      case API_ACTIONS.PUT: {
        const response =
          type === API_TYPE.JSON
            ? await axiosJSON.put(api_url, JSON.stringify(data))
            : await axiosFORM.put(api_url, data);
        return response?.data;
      }
      case API_ACTIONS.DELETE: {
        const response = await axiosJSON.delete(api_url);
        return response?.data;
      }
      default: {
        toast.error("Invalid Api action");
      }
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};
