export type UserLogin = {email: string; username: string; ssoid: string; type: string; photo: string};
export type LoginAuth = {status: string; auth: UserLogin} | null;
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
export type ProductProps = {
  productid: number;
  title: string;
  thumbnail: string;
  option: string;
  count: number;
  cost: number;
};
export type UserProps = {
  userid: string;
  username: string;
  phone: string;
};
export type LoginUserProps = {
  userid: string;
  username: string;
  phone: string;
  email: string;
  imageUrl: string;
  googleId: string;
  tokenId: string;
  accessToken: string;
};
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
export type ThumbnailImageProps = {
  image: string;
};
export type OrderedProductProps = {
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
export type DeleveryDataProps = {
  phone: string;
  alias: string;
  postcode: string;
  address1: string;
  address2: string;
};
