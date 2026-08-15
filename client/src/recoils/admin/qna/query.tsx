import {useQuery} from "react-query";
import {options} from "@recoils/common";
import {getAdminProductQna} from "@recoils/admin/qna/axios";

export const useAdminProductQnaQuery = () => {
  const {isLoading, isError, data, error, refetch} = useQuery("adminProductQna", () => getAdminProductQna(), options);
  return {isLoading, isError, data: data?.data, error, refetch};
};
