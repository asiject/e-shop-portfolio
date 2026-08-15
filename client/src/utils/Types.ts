export type MainProduct = {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  cost: number;
  discountType: string;
  discountValue: number;
  capacity: number;
  option: string;
};
export type ProductsProduct = {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  cost: number;
  capacity: number;
  optionCnt: number;
  showyn: string;
  stock: number;
};
export type Product = {
  productid: number;
  title: string;
  thumbnail: string;
  option: string;
  count: number;
  cost: number;
};
export type User = {
  userid: string;
  username: string;
  phone: string;
};
export interface LoginUser {
  userid: number;
  username: string;
  phone: string;
  email: string;
  imageUrl: string;
  googleId: string;
  tokenId: string;
  accessToken: string;
}
export type FormValues = {
  receiver: string;
  receiverPhone: string;
  receiverEmail: string;
  addressNickname: string;
  addAddress: string;
  selectAddress: string;
  postcode: string;
  address1: string;
  address2: string;
  description: string;
  payname: string;
  paynumber: string;
  type: string;
};
export type ThumbnailImage = {
  image: string;
};
export type OrderedProduct = {
  itemid: number;
  key: string;
  val: string;
  itemkey: string;
  itemval: string;
  cost: number;
  price: number;
  capacity: number;
  stock: number;
};
export type DeleveryData = {
  phone: string;
  alias: string;
  postcode: string;
  address1: string;
  address2: string;
};

export type OrderLine = {
  productid: number;
  itemid: number;
  option?: string;
  count?: number;
  cost?: number;
  title?: string;
  thumbnail?: string;
};

export type OrderListRow = {
  orderid: string;
  status?: string;
  createdate?: string;
  products?: OrderLine[];
};
