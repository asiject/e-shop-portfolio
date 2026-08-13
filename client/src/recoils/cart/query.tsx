import {useQuery} from "react-query";
import {options} from "@recoils/common";
import {getCartList} from "@recoils/cart/axios";

export const getCartListQuery = (userid: number) => {
  const {isLoading, isError, data, error} = useQuery("getCartList", () => getCartList(userid), options);
  return {isLoading, isError, data: data?.data, error};
};
