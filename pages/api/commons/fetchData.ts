import axios from "axios";

export const fetchData = async (url: string) => {
    try {
        const data = await axios.get(url);
        return data;
    }
    catch(err) {
        return null;
    }
}