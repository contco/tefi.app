import { EXTRATERRESTRIAL_URl } from "../utils";
import { fetchData } from "./fetchData";
export {fetchData} from "./fetchData";



export const getPriceBySymbol = async (symbol) => {
  if(symbol){
    const pricesRequest:any = await fetchData(EXTRATERRESTRIAL_URl)
    const tokenPrice = pricesRequest.data.prices[symbol].price;
    if(tokenPrice){
      return tokenPrice
    }
  }
  return 0;
}