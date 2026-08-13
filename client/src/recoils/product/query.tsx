import {useQuery} from "react-query";
import {options} from "@recoils/common";
import {getProductList, getProduct, getProductListByCategoryid, getNewProductList} from "@recoils/product/axios";

export const getProductListQuery = () => {
  const {isLoading, isError, data, error} = useQuery("getProductList", () => getProductList(), options);
  return {isLoading, isError, data: data?.data, error};
};
export const getNewProductListQuery = () => {
  const {isLoading, isError, data, error} = useQuery("getNewProductList", () => getNewProductList(), options);
  return {isLoading, isError, data: data?.data, error};
};
export const getProductQuery = (productid: string, opts = options) => {
  const {isLoading, isError, data, error} = useQuery("getProduct", () => getProduct(productid), opts);
  return {isLoading, isError, data: data?.data, error};
};
export const getProductListByCategoryidQuery = (categoryid: number) => {
  const {isLoading, isError, data, error} = useQuery(
    ["getProductListByCategoryid", categoryid],
    () => getProductListByCategoryid(categoryid),
    options,
  );
  return {isLoading, isError, data: data?.data, error};
};
