import {useQuery} from "react-query";
import {options} from "@recoils/common";
import {getCategoryInfo, getCategoryList} from "@recoils/category/axios";

export const useCategoryListQuery = () => {
  const {isLoading, isError, data, error} = useQuery("getCategoryList", () => getCategoryList(), options);
  return {isLoading, isError, data: data?.data, error};
};
export const useCategoryInfoQuery = (id: number) => {
  const {isLoading, isError, data, error} = useQuery("getCategoryInfo", () => getCategoryInfo(id), options);
  return {isLoading, isError, data: data?.data, error};
};
