import {api} from "@recoils/common";

export const getAdminProductQna = () => api.get("/admin/qna");
export const putAdminProductQnaAnswer = (id: number, answer: string) => api.put(`/admin/qna/${id}`, {answer});
