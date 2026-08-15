import {useQuery} from "react-query";
import {options} from "@recoils/common";
import {getProductList, getProduct, getProductListByCategoryid, getProductQna} from "@recoils/product/axios";

export const useProductListQuery = () => {
  const {isLoading, isError, data, error, refetch} = useQuery("getProductList", () => getProductList(), options);
  return {isLoading, isError, data: data?.data, error, refetch};
};

export const useProductQuery = (productid: string, opts: Record<string, unknown> = {}) => {
  const {isLoading, isError, data, error, refetch} = useQuery(
    ["getProduct", productid],
    () => getProduct(productid),
    {...options, enabled: Boolean(productid) && opts.enabled !== false, ...opts},
  );
  return {isLoading, isError, data: data?.data, error, refetch};
};

export const useProductListByCategoryidQuery = (categoryid: number) => {
  const {isLoading, isError, data, error} = useQuery(
    ["getProductListByCategoryid", categoryid],
    () => getProductListByCategoryid(categoryid),
    options,
  );
  return {isLoading, isError, data: data?.data, error};
};

export const useProductQnaQuery = (productid: string | number | undefined) => {
  const {isLoading, isError, data, error, refetch} = useQuery(
    ["getProductQna", productid],
    () => getProductQna(productid as string | number),
    {...options, enabled: Boolean(productid)},
  );
  return {isLoading, isError, data: data?.data, error, refetch};
};
