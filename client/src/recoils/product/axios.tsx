import axios from "axios";
import {api} from "@recoils/common";
export const getProductList = () => api.get(`/product`);
export const getProduct = (productid: string) => {
  return api.get(`/product/${productid}`);
};
export const getProductQna = (productid: string | number) => api.get(`/product/${productid}/qna`);
export const postProductQna = (productid: string | number, body: {
  kind: string;
  body: string;
  orderid?: string;
}) => api.post(`/product/${productid}/qna`, body);
export async function getProductListByCategoryid(categoryid: number) {
  return api.get(`/category/${categoryid}/product`);
}
