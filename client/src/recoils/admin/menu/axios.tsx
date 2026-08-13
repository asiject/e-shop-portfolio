import {api, axiosProcess} from "@recoils/common";

export async function getAdminMenuList() {
  return await axiosProcess(async () => {
    return await api.get(`/admin/menues`);
  });
}
export const putMenuUseYn = (menues: {id: number; useyn: string}[]) => api.put("/admin/menues/useyn", {menues});
export const putMenuSortno = (menues: {id: number; sortno: number}[]) => api.put("/admin/menues/sortno", {menues});
export const postAdminMenu = (body: {title: string; url: string; useyn?: string; sortno?: number}) => api.post("/admin/menues", body);
export const deleteAdminMenu = (id: number) => api.delete(`/admin/menues/${id}`);
