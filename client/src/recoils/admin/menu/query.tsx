import {useQuery} from "react-query";
import {options} from "@recoils/common";
import {getAdminMenuList} from "./axios";

export const getAdminMenuListQuery = () => {
  const {isLoading, isError, data, error} = useQuery("getAdminMenuList", () => getAdminMenuList(), options);
  return {isLoading, isError, data: data?.data, error};
};
