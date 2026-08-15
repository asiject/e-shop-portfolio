import {Navigate, Route} from "react-router";
import {useRecoilValue} from "recoil";
import {userState} from "@recoils/user/state";
import {getShopHomePath} from "@utils/safeBack";
import AdminGnb from "@layout/AdminGnb";
import NotFound from "@layout/NotFound";
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
import ProductQnaList from "@admin/product/ProductQnaList";
import OrderList from "@admin/order/OrderList";
import ClaimList from "@admin/order/ClaimList";
import ShipmentList from "@admin/order/ShipmentList";

function RequireAdmin({children}: {children: React.ReactNode}) {
  const loginUser = useRecoilValue(userState);
  if (!loginUser?.isAdmin) {
    return <Navigate to={getShopHomePath()} replace />;
  }
  return <>{children}</>;
}

export const adminRoutes = [
  <Route key="admin-login" path="/admin" element={<AdminLogin />} />,
  <Route
    key="admin-dashboard"
    path="/admin/dashboard"
    element={
      <RequireAdmin>
        <AdminDashboard />
      </RequireAdmin>
    }
  />,
  <Route
    key="admin-role"
    path="/admin/role"
    element={
      <RequireAdmin>
        <AdminRoleList />
      </RequireAdmin>
    }
  />,
  <Route
    key="admin-menu"
    path="/admin/menu"
    element={
      <RequireAdmin>
        <MenuList />
      </RequireAdmin>
    }
  />,
  <Route
    key="admin-product"
    path="/admin/product"
    element={
      <RequireAdmin>
        <ProductList />
      </RequireAdmin>
    }
  />,
  <Route
    key="admin-product-write"
    path="/admin/product/write"
    element={
      <RequireAdmin>
        <ProductWrite />
      </RequireAdmin>
    }
  />,
  <Route
    key="admin-product-write-id"
    path="/admin/product/write/:id"
    element={
      <RequireAdmin>
        <ProductWrite />
      </RequireAdmin>
    }
  />,
  <Route
    key="admin-product-qna"
    path="/admin/product/qna"
    element={
      <RequireAdmin>
        <ProductQnaList />
      </RequireAdmin>
    }
  />,
  <Route
    key="admin-product-id"
    path="/admin/product/:id"
    element={
      <RequireAdmin>
        <ProductView />
      </RequireAdmin>
    }
  />,
  <Route
    key="admin-policy"
    path="/admin/policy"
    element={
      <RequireAdmin>
        <PolicyList />
      </RequireAdmin>
    }
  />,
  <Route
    key="admin-category"
    path="/admin/category"
    element={
      <RequireAdmin>
        <CategoryList />
      </RequireAdmin>
    }
  />,
  <Route
    key="admin-category-id"
    path="/admin/category/:id"
    element={
      <RequireAdmin>
        <CategoryProductList />
      </RequireAdmin>
    }
  />,
  <Route
    key="admin-order"
    path="/admin/order"
    element={
      <RequireAdmin>
        <OrderList />
      </RequireAdmin>
    }
  />,
  <Route
    key="admin-shipment"
    path="/admin/shipment"
    element={
      <RequireAdmin>
        <ShipmentList />
      </RequireAdmin>
    }
  />,
  <Route
    key="admin-claim"
    path="/admin/claim"
    element={
      <RequireAdmin>
        <ClaimList />
      </RequireAdmin>
    }
  />,
  <Route
    key="admin-404"
    path="/admin/*"
    element={
      <RequireAdmin>
        <AdminGnb>
          <NotFound />
        </AdminGnb>
      </RequireAdmin>
    }
  />,
];
