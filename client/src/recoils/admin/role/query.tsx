import {useQuery} from "react-query";
import {options} from "@recoils/common";
import {getAdminRoleUserList} from "./axios";

export const useAdminRoleUserListQuery = () => {
  const {isLoading, isError, data, error} = useQuery("getAdminRoleUserList", () => getAdminRoleUserList(), options);
  return {isLoading, isError, data: data?.data, error};
};
