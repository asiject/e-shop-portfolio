import {ProductProps} from "@props";
import {atom} from "recoil";

export const productListState = atom<ProductProps[]>({
  key: "productList",
  default: [],
});
export const productState = atom<ProductProps>({
  key: "product",
  default: {productid: 0, title: "", thumbnail: "", option: "", count: 0, cost: 0},
});
export const productListByCategoryidState = atom({
  key: "productListByCategoryid",
  default: [],
});
