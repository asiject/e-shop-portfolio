import {api} from "@recoils/common";

export const getAdminOrders = () => api.get("/admin/orders");
export const getAdminOrdersWait = () => api.get("/admin/orders/wait");
export const getAdminOrdersShipment = () => api.get("/admin/orders/shipment");
export const getAdminOrdersClaimCancel = () => api.get("/admin/orders/claim/cancel");
export const getAdminOrdersClaimReturn = () => api.get("/admin/orders/claim/return");
export const getAdminOrdersClaimChange = () => api.get("/admin/orders/claim/change");
export const putAdminOrdersStatus = (ids: string[], status: string) => api.put("/admin/orders/status", {ids, status});
