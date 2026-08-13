import {api} from "@recoils/common";
export const putProductSortno = (products: {id: number; showyn: string}[]) => api.put("/admin/product/sortno", {products});
