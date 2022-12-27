import axios from "axios";
import { MANTLE_URL } from "../constants";

export const getLastSyncedHeight = async () => {
    try {
      const LAST_SYNCED_HEIGHT_QUERY = `
        query {
          LastSyncedHeight
        }
      `;
      const payload = {query: LAST_SYNCED_HEIGHT_QUERY, variables: {} };
      const {data}: any = await axios.post(MANTLE_URL + "?last-synced-height", payload);
      return data?.data?.LastSyncedHeight;
    }
    catch(err) {
      throw new Error("Error fetching last synced height");
    }
  }
  