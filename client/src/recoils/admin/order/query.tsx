import {useQuery} from "react-query";
import {options} from "@recoils/common";
import {
  getAdminOrders,
  getAdminOrdersWait,
  getAdminOrdersShipment,
  getAdminOrdersClaimCancel,
  getAdminOrdersClaimReturn,
  getAdminOrdersClaimChange,
} from "./axios";

export const useAdminOrdersQuery = () => {
  const q = useQuery("adminOrders", () => getAdminOrders(), options);
  return {...q, data: q.data?.data};
};

export const useAdminOrdersWaitQuery = () => {
  const q = useQuery("adminOrdersWait", () => getAdminOrdersWait(), options);
  return {...q, data: q.data?.data};
};

export const useAdminOrdersShipmentQuery = () => {
  const q = useQuery("adminOrdersShipment", () => getAdminOrdersShipment(), options);
  return {...q, data: q.data?.data};
};

export const useAdminOrdersClaimCancelQuery = () => {
  const q = useQuery("adminOrdersClaimCancel", () => getAdminOrdersClaimCancel(), options);
  return {...q, data: q.data?.data};
};

export const useAdminOrdersClaimReturnQuery = () => {
  const q = useQuery("adminOrdersClaimReturn", () => getAdminOrdersClaimReturn(), options);
  return {...q, data: q.data?.data};
};

export const useAdminOrdersClaimChangeQuery = () => {
  const q = useQuery("adminOrdersClaimChange", () => getAdminOrdersClaimChange(), options);
  return {...q, data: q.data?.data};
};

export const useAdminDashboardStatsQuery = () => {
  const wait = useAdminOrdersWaitQuery();
  const shipment = useAdminOrdersShipmentQuery();
  const complete = useAdminOrdersQuery();
  const cancel = useAdminOrdersClaimCancelQuery();
  const ret = useAdminOrdersClaimReturnQuery();
  const change = useAdminOrdersClaimChangeQuery();

  const isLoading = wait.isLoading || shipment.isLoading || complete.isLoading || cancel.isLoading || ret.isLoading || change.isLoading;
  const isError = wait.isError || shipment.isError || complete.isError || cancel.isError || ret.isError || change.isError;
  const refetch = async () => {
    await Promise.all([
      wait.refetch(),
      shipment.refetch(),
      complete.refetch(),
      cancel.refetch(),
      ret.refetch(),
      change.refetch(),
    ]);
  };

  return {
    isLoading,
    isError,
    refetch,
    stats: {
      wait: wait.data?.length || 0,
      shipment: shipment.data?.length || 0,
      complete: complete.data?.length || 0,
      cancel: cancel.data?.length || 0,
      return: ret.data?.length || 0,
      change: change.data?.length || 0,
    },
  };
};
