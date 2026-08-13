import ShopShell from "theme/ShopShell";
import WebRoutes from "./WebRoutes";
import MobileRoutes from "./MobileRoutes";

export default function ShopRoutes() {
  return (
    <ShopShell>
      <WebRoutes />
      <MobileRoutes />
    </ShopShell>
  );
}
