import MGnb from "@layout/MGnb";
import NotFound from "@layout/NotFound";
import MCartList from "@mobile/cart/MCartList";
import MCategory from "@mobile/category/MCategory";
import MMain from "@mobile/MMain";
import MOrderDetails from "@mobile/orderList/MOrderDetails";
import MOrderList from "@mobile/orderList/MOrderList";
import MOrderSheetList from "@mobile/orderSheet/MOrderSheetList";
import MOrderSheetResult from "@mobile/orderSheet/MOrderSheetResult";
import MProduct from "@mobile/products/MProduct";
import {Route} from "react-router";

export const mobileRoutes = [
  <Route key="mobile" path="/m" element={<MGnb />}>
    <Route path="" element={<MMain />} />
    <Route path="category/:id" element={<MCategory />} />
    <Route path="products/:productid" element={<MProduct />} />
    <Route path="cart/list" element={<MCartList />} />
    <Route path="order/sheet/:id" element={<MOrderSheetList />} />
    <Route path="order/sheet/:id/result" element={<MOrderSheetResult />} />
    <Route path="order/list" element={<MOrderList />} />
    <Route path="order/:id" element={<MOrderDetails />} />
    <Route path="*" element={<NotFound />} />
  </Route>,
];
