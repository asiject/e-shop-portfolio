import {api} from "@recoils/common";

export const getCategoryList = () => api.get(`/admin/category`);
export const getCategoryInfo = (id: number) => api.get(`/admin/category/${id}/products`);

export const putCategoryUseYn = (categories: {id: number; useyn: string}[]) => api.put("/category/useyn", {categories});
export const putCategorySortno = (categories: {id: number; sortno: number}[]) => api.put("/category/sortno", {categories});
export const postCategoryProduct = (id: number, pids: any) => api.post(`/admin/category/${id}/product`, pids);
export const deleteCategoryProduct = (id: number, pid: number) => api.delete(`/admin/category/${id}/product/${pid}`);
