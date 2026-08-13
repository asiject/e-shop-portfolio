import {useQuery} from "react-query";
import {options} from "@recoils/common";
import {getUserList} from "./axios";

export const getUserListQuery = () => {
  const {isLoading, isError, data, error} = useQuery("getUserListQuery", () => getUserList(), options);
  return {isLoading, isError, data: data?.data, error};
};
