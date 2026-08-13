import {api} from "@recoils/common";

export const getDiscountPolicy = () => api.get("/policy/discount");
export const putDiscountPolicy = (body: {id: number; type: string; value: number; useyn: string}) => api.put("/policy/discount", body);
export const getDeliveryPolicy = () => api.get("/policy/delivery");
export const putDeliveryPolicy = (body: {
  id: number;
  company: string;
  price: number;
  address: string;
  return_price: number;
  change_price: number;
  conditions: number;
}) => api.put("/policy/delivery", body);
