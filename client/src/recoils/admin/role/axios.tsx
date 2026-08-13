import {api, axiosProcess} from "@recoils/common";

export async function getAdminRoleUserList() {
  return await axiosProcess(async () => {
    return await api.get(`/admin/users/roles`);
  });
}
export const postAdminRoleUser = (roleid: string, params: {uids: string[]}) => api.post(`/admin/role/${roleid}`, params);
export const deleteAdminRoleUser = (roleid: string, userid: string) => api.delete(`/admin/role/${roleid}/${userid}`);
