import Gnb from "@layout/Gnb";
import CartList from "@web/cart/CartList";
import Category from "@web/category/Category";
import Main from "@web/Main";
import Login from "@web/member/login/Login";
import Register from "@web/member/register/Register";
import OrderDetails from "@web/orderList/OrderDetails";
import OrderList from "@web/orderList/OrderList";
import OrderSheetList from "@web/orderSheet/OrderSheetList";
import OrderSheetResult from "@web/orderSheet/OrderSheetResult";
import Product from "@web/products/Product";
import {Route, Routes} from "react-router";
export default function WebRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<Gnb />}>
        <Route path="/" element={<Main />} />
        <Route path="/category/:id" element={<Category />} />
        <Route path="/products/:productid" element={<Product />} />
        <Route path="/cart/list" element={<CartList />} />
        <Route path="/order/sheet/:id" element={<OrderSheetList />} />
        <Route path="/order/sheet/:id/result" element={<OrderSheetResult />} />
        <Route path="/order/list" element={<OrderList />} />
        <Route path="/order/:id" element={<OrderDetails />} />
      </Route>
    </Routes>
  );
}
