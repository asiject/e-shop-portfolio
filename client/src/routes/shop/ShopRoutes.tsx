import {Route, Routes} from "react-router";
import NotFound from "@layout/NotFound";
import ShopShell from "theme/ShopShell";
import {adminRoutes} from "../admin/AdminRoutes";
import {mobileRoutes} from "./MobileRoutes";
import {webRoutes} from "./WebRoutes";

export default function ShopRoutes() {
  return (
    <ShopShell>
      <Routes>
        {webRoutes}
        {mobileRoutes}
        {adminRoutes}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ShopShell>
  );
}
