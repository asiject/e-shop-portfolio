import axios from "axios";
import {api} from "@recoils/common";
export const getProductList = () => api.get(`/product`);
export const getProduct = (productid: string) => {
  return api.get(`/product/${productid}`);
};
export async function getProductListByCategoryid(categoryid: number) {
  return api.get(`/category/${categoryid}/product`);
}
