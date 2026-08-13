import {api} from "@recoils/common";

export const putProductSortno = (products: {id: number; showyn: string}[]) => api.put("/admin/product/sortno", {products});

export const postAdminProduct = (body: {
  categoryids: number[];
  productname: string;
  price: number;
  stock: number;
  showyn: string;
  content?: string;
  description?: string;
  thumbnail?: string;
  images?: string[];
  details?: {
    optkey: string;
    optvals: string;
    items?: {itemkey: string; itemval: string; price?: number; capacity?: number; useyn?: string}[];
  }[];
}) => api.post("/admin/product", body);

export const putAdminProduct = (body: {
  id: number;
  title?: string;
  description?: string;
  thumbnail?: string;
  cost?: number;
  capacity?: number;
  optionCnt?: number;
  showyn?: string;
  editor?: string;
}) => api.put("/admin/product", body);

export const deleteAdminProduct = (productid: number) => api.delete(`/admin/product/${productid}`);

export const uploadAdminProductImage = (file: File) => {
  const form = new FormData();
  form.append("file", file);
  return api.post("/admin/product/upload", form, {
    headers: {"Content-Type": "multipart/form-data"},
  });
};
