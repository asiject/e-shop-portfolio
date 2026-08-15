import {useQuery} from "react-query";
import {options} from "@recoils/common";
import {getOrderSheet, getOrderSheetResult, getRecentDestination, getOrderList, getOrderDetail} from "@recoils/order/axios";

export const useOrderSheetQuery = ({userid, orderid}: {userid: string; orderid: string}) => {
  const {isLoading, isError, data, error} = useQuery(
    ["getOrderSheet", userid, orderid],
    () => getOrderSheet(userid, orderid),
    {...options, enabled: Boolean(userid && orderid)},
  );
  return {isLoading, isError, data: data?.data, error};
};
export const useOrderSheetResultQuery = ({userid, orderid}: {userid: string; orderid: string}) => {
  const {isLoading, isError, data, error} = useQuery(
    ["getOrderSheetResult", userid, orderid],
    () => getOrderSheetResult(userid, orderid),
    {...options, enabled: Boolean(userid && orderid)},
  );
  return {isLoading, isError, data: data?.data, error};
};
export const useRecentDestinationQuery = (userid: string) => {
  const {isLoading, isError, data, error, refetch} = useQuery("getRecentDestination", () => getRecentDestination(userid), options);
  return {isLoading, isError, data: data?.data, error, refetch};
};
export const useOrderListQuery = ({userid}: {userid: string}) => {
  const {isLoading, isError, data, error} = useQuery("getOrderList", () => getOrderList(userid), options);
  return {isLoading, isError, data: data?.data, error};
};
export const useOrderDetailQuery = ({userid, orderid}: {userid: string; orderid: string}) => {
  const {isLoading, isError, data, error} = useQuery(
    ["getOrderDetail", userid, orderid],
    () => getOrderDetail(userid, orderid),
    {...options, enabled: Boolean(userid && orderid)},
  );
  return {isLoading, isError, data: data?.data, error};
};
