import {Suspense} from "react";
import {userState} from "@recoils/user/state";
import {useRecoilValue} from "recoil";
import ShopRoutes from "routes/shop/ShopRoutes";
import AdminRoutes from "routes/admin/AdminRoutes";
import Loading from "@layout/Loading";
export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <AppRoutes />
    </Suspense>
  );
}
function AppRoutes() {
  useRecoilValue(userState);
  return (
    <>
      <ShopRoutes />
      <AdminRoutes />
    </>
  );
}
