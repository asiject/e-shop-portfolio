import AdminDashboard from "@admin/dashboard/AdminDashboard";
import AdminLogin from "@admin/AdminLogin";
import CategoryList from "@admin/category/CategoryList";
import MenuList from "@admin/menu/MenuList";
import PolicyList from "@admin/policy/PolicyList";
import ProductList from "@admin/product/ProductList";
import AdminRoleList from "@admin/role/AdminRoleList";
import {userState} from "@recoils/user/state";
import {Route, Routes} from "react-router";
import {useRecoilValue} from "recoil";
import CategoryProductList from "@admin/category/CategoryProductList";
import ProductView from "@admin/product/ProductView";
import ProductWrite from "@admin/product/ProductWrite";

export default function AdminRoutes() {
  const loginUser = useRecoilValue(userState);
  return (
    <Routes>
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/role" element={<AdminRoleList />} />
      <Route path="/admin/menu" element={<MenuList />} />
      <Route path="/admin/product" element={<ProductList />} />
      <Route path="/admin/product/write" element={<ProductWrite />} />
      <Route path="/admin/product/write/:id" element={<ProductWrite />} />
      <Route path="/admin/product/:id" element={<ProductView />} />
      <Route path="/admin/policy" element={<PolicyList />} />
      <Route path="/admin/category" element={<CategoryList />} />
      <Route path="/admin/category/:id" element={<CategoryProductList />} />
    </Routes>
  );
}
