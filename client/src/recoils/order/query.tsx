import {useQuery} from "react-query";
import {options} from "@recoils/common";
import {getOrderSheet, getOrderSheetResult, getRecentDestination, getOrderList, getOrderDetail} from "@recoils/order/axios";

export const getOrderSheetQuery = ({userid, orderid}: {userid: string; orderid: string}) => {
  const {isLoading, isError, data, error} = useQuery("getOrderSheet", () => getOrderSheet(userid, orderid), options);
  return {isLoading, isError, data: data?.data, error};
};
export const getOrderSheetResultQuery = ({userid, orderid}: {userid: string; orderid: string}) => {
  const {isLoading, isError, data, error} = useQuery("getOrderSheetResult", () => getOrderSheetResult(userid, orderid), options);
  return {isLoading, isError, data: data?.data, error};
};
export const getRecentDestinationQuery = (userid: string) => {
  const {isLoading, isError, data, error, refetch} = useQuery("getRecentDestination", () => getRecentDestination(userid), options);
  return {isLoading, isError, data: data?.data, error, refetch};
};
export const getOrderListQuery = ({userid}: {userid: string}) => {
  const {isLoading, isError, data, error} = useQuery("getOrderList", () => getOrderList(userid), options);
  return {isLoading, isError, data: data?.data, error};
};
export const getOrderDetailQuery = ({userid, orderid}: {userid: string; orderid: string}) => {
  const {isLoading, isError, data, error} = useQuery("getOrderDetail", () => getOrderSheetResult(userid, orderid), options);
  return {isLoading, isError, data: data?.data, error};
};
