import {Navigate, Route, Routes} from "react-router";
import {useRecoilValue} from "recoil";
import {userState} from "@recoils/user/state";
import AdminDashboard from "@admin/dashboard/AdminDashboard";
import AdminLogin from "@admin/AdminLogin";
import CategoryList from "@admin/category/CategoryList";
import MenuList from "@admin/menu/MenuList";
import PolicyList from "@admin/policy/PolicyList";
import ProductList from "@admin/product/ProductList";
import AdminRoleList from "@admin/role/AdminRoleList";
import CategoryProductList from "@admin/category/CategoryProductList";
import ProductView from "@admin/product/ProductView";
import ProductWrite from "@admin/product/ProductWrite";
import OrderList from "@admin/order/OrderList";
import ClaimList from "@admin/order/ClaimList";
import ShipmentList from "@admin/order/ShipmentList";

function RequireAdmin({children}: {children: React.ReactNode}) {
  const loginUser = useRecoilValue(userState);
  if (!loginUser?.isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  return <>{children}</>;
}

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <RequireAdmin>
            <AdminDashboard />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/role"
        element={
          <RequireAdmin>
            <AdminRoleList />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/menu"
        element={
          <RequireAdmin>
            <MenuList />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/product"
        element={
          <RequireAdmin>
            <ProductList />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/product/write"
        element={
          <RequireAdmin>
            <ProductWrite />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/product/write/:id"
        element={
          <RequireAdmin>
            <ProductWrite />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/product/:id"
        element={
          <RequireAdmin>
            <ProductView />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/policy"
        element={
          <RequireAdmin>
            <PolicyList />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/category"
        element={
          <RequireAdmin>
            <CategoryList />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/category/:id"
        element={
          <RequireAdmin>
            <CategoryProductList />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/order"
        element={
          <RequireAdmin>
            <OrderList />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/shipment"
        element={
          <RequireAdmin>
            <ShipmentList />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/claim"
        element={
          <RequireAdmin>
            <ClaimList />
          </RequireAdmin>
        }
      />
    </Routes>
  );
}
