const primaryColor = "#9ac66d";
// const primaryColor = "#f9c1ca";
export default {
  //GNB
  container: {
    margin: "0 auto 100px",
    width: 1024,
    display: "flex",
    flexDirection: "column",
  },
  srch: {
    width: 1024,
    margin: "0 auto",
    height: 140,
    display: "flex",
    justifyContent: "space-between",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    img: {
      width: 120,
    },
  },
  srchbar: {
    width: "100%",
    height: "80px",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
  },
  menulist: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 0,
    width: "100%",
    li: {
      borderBottom: "2px solid palegreen",
      margin: "0 2px",
    },
  },
  menubox: {
    width: "100%",
    height: 50,
    marginTop: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px 0",
  },
  rightbox: {
    display: "flex",
    flexDirection: "column",
    marginLeft: "16px",
  },
  topicon: {
    display: "flex",
    // flexDirection: "row-reverse",
    justifyContent: "flex-end",
    width: "100%",
    height: "40px",
    button: {
      boxShadow: "none !important",
      border: "0 !important",
      overflow: "hidden",
      div: {
        margin: "0 !important",
      },
      span: {
        display: "none",
      },
    },
  },
  iconbox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 2,
  },
  icon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    svg: {
      cursor: "pointer",
      fontSize: 30,
      color: primaryColor,
    },
  },
  srchInput: {
    width: 160,
    height: 54,
    input: {
      padding: "10px 0 10px 12px",
    },
  },
  gnb: {
    width: "100%",
    marginBottom: "20px",
    minWidth: "1024px",
    display: "flex",
    flexDirection: "column",
    "ul, li": {
      listStyle: "none",
      marginTop: 0,
      marginBottom: 0,
    },
    a: {
      color: "black",
      textDecoration: "none",
    },
    "a:hover": {
      fontWeight: "bold",
    },
  },
  menu: {
    height: 38,
    padding: "0 12px",
    lineHeight: "38px",
  },
  //MAIN
  mainImage: {
    margin: "0 auto",
    img: {width: "100%"},
  },
  newGoodsHeader: {
    width: "1024px",
    margin: "0 auto",
    display: "flex",
    paddingLeft: "15px",
    // marginTop: "50px",
    // marginBottom: "13px",
    div: {fontSize: "22px", fontWeight: "bold"},
  },
  newGoods: {
    display: "flex",
    overflow: "auto",
    flexWrap: "wrap",
    // justifyContent: "space-between",
    li: {marginBottom: "24px"},
  },
  // COMMON
  bold: {
    fontWeight: "bold",
  },
  none: {
    display: "none",
  },
  flex: {
    display: "flex",
  },
  textCenter: {
    textAlign: "center",
  },
  font12: {fontSize: 12},
  font14: {fontSize: 14},
  font16: {fontSize: 16},
  font20: {fontSize: 20},
  mt5: {
    marginTop: "5px",
  },
  mt10: {
    marginTop: "10px",
  },
  mt20: {
    marginTop: "20px",
  },
  mlAuto: {
    marginLeft: "auto",
  },
  w100per: {
    width: "100%",
  },
  w50c: {
    width: "50px",
    textAlign: "center",
  },
  w68c: {
    width: "68px",
    textAlign: "center",
  },
  w100c: {
    width: "100px",
    textAlign: "center",
  },
  w200: {
    width: "200px",
  },
  w200c: {
    width: "200px",
    textAlign: "center",
  },
  w405: {width: "405px"},
  w550c: {
    width: "550px",
    textAlign: "center",
  },
  w500c: {
    width: "500px",
    textAlign: "center",
  },
  // COMMON - CARD
  card: {
    width: "25%",
    display: "flex",
    flexDirection: "column",
    a: {textDecoration: "none"},
  },
  cardContent: {
    fontSize: "14px",
    width: "100%",
    img: {width: "226px", height: "226px", display: "block", margin: "0 auto"},
    "div strong": {
      color: "navy",
    },
    "div:last-child": {
      overflow: "hidden",
      textOverflow: "ellipsis",
      wordWrap: "normal",
      wordBreak: "break-word",
      fontSize: "12px",
      display: "-webkit-box",
      color: "#888",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      marginTop: "10px",
    },
  },
  cardTitle: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    wordWrap: "normal",
    wordBreak: "break-word",
    fontWeight: "bold",
    marginTop: "10px",
    color: "Black",
  },
  // CATEGORY
  categoryBox: {
    display: "flex",
    marginTop: "50px",
    marginBottom: "13px",
  },
  categoryTitle: {
    fontSize: "22px",
    fontWeight: "bold",
  },
  // ListView
  listViewBox: {
    display: "flex",
    flexDirection: "column",
  },
  // PRODUCT
  productBox: {
    display: "flex",
    margin: "40px auto 20px",
    border: "1px solid #ededed",
    backgroundColor: "#FFF",
  },
  productLeft: {
    width: "510px",
    "a:hover": {background: "none"},
    img: {width: "510px", height: "510px"},
  },
  productRight: {
    width: "419px",
    padding: "30px 40px",
    borderLeft: "1px solid #ededed",
  },
  productPrice: {
    display: "flex",
    marginBottom: "10px",
    "> div": {
      display: "flex",
      marginLeft: "auto",
      alignItems: "center",
      "div + div": {marginLeft: "10px"},
    },
  },
  productTotalValues: {
    display: "flex",
    justifyContent: "flex-end",
    margin: "10px 0",
  },
  productStock: {
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    marginRight: "1px",
    "> div": {
      backgroundColor: "#e2e2e2",
      span: {
        paddingRight: "12px",
        marginRight: "1px",
        backgroundColor: "#ffffff",
      },
    },
  },
  productCost: {
    backgroundColor: "#ffffff",
    paddingLeft: "12px",
    fontSize: "24px",
    color: "#6b90dc",
  },
  productBtnArea: {
    marginTop: "10px",
    display: "flex",
    button: {
      padding: 0,
    },
    "button + button": {marginLeft: "5px"},
    "button div": {
      display: "block",
      width: "100%",
      padding: "8px 0",
    },
  },
  productOrderBtn: {
    flexGrow: 3,
    padding: 0,
  },
  productCartBtn: {
    flexGrow: 1,
  },
  package: {
    margin: "10px 0",
    width: "100%",
  },
  packageInfo: {
    ">div": {
      minHeight: "35px",
      lineHeight: "35px",
    },
    button: {
      minHeight: "35px",
      padding: 0,
    },
    svg: {
      position: "relative",
      top: "6px",
    },
    span: {
      fontSize: "16px",
    },
  },
  //tab Product
  tabProduct: {
    width: 998,
    border: "1px solid #dee0e2",
    maxHeight: 275,
    overflowY: "auto",
    overflowX: "hidden",
    padding: "0px 40px",
    display: "flex",
    "> div": {
      width: "100%",
      height: "fit-content",
      padding: "10px",
    },
  },
  productInfoArea: {
    width: "100%",
    strong: {
      fontSize: "20px",
    },
  },
  optionArea: {
    width: "100%",
  },
  noneOption: {display: "none"},
  totalInfoArea: {
    width: "100%",
    fieldset: {
      border: 0,
    },
  },
  optionFormBox: {
    margin: "10px 0",
    width: "100%",
  },
  location: {
    width: "400px",
    borderTop: "1px solid #ddd",
    padding: "0 24px 20px",
    svg: {marginRight: "10px"},
  },
  productTabContainer: {
    display: "none",
    flexDirection: "column",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    borderBottom: "1px solid black",
    background: "#fff",
    zIndex: 110,
    "> ul": {width: 1024, borderBottom: 0},
    "> div": {
      display: "flex",
      justifyContent: "space-between",
      width: "1024px",
      margin: "12px auto",
    },
  },
  tabThumbnail: {
    width: 50,
    height: 50,
    display: "flex",
    alignItems: "center",
    img: {width: "100%"},
  },
  tabInfo: {
    width: "calc(100% - 180px)",
    margin: "0 20px",
    display: "flex",
    flexDirection: "column",
    div: {fontSize: "18px"},
    "div:last-child": {fontSize: "14px"},
  },
  tabOpen: {
    width: "90px",
    display: "flex",
    alignItems: "center",
  },
  contentMenubar: {
    height: "40px",
    display: "flex",
    justifyContent: "space-around",
    borderBottom: "1px solid black",
    position: "sticky",
    margin: "0 auto",
    zIndex: 100,
    top: 0,
    backgroundColor: "#fff",
    button: {
      width: "100%",
      height: "100%",
      textDecoration: "none",
      padding: "12px 0",
    },
    li: {
      width: "100%",
      textAlign: "center",
      backgroundColor: "#f3f5f7",
    },
  },
  // TackBack 반품 정보
  takeBack: {
    fontSize: "14px",
    thead: {
      borderTop: "solid black 1px",
    },
    ol: {
      paddingInlineStart: "16px",
    },
    span: {
      fontSize: "12px",
      color: "#8f8f8f",
    },
  },
  // CARTLIST + ORDER
  orderWrapper: {
    backgroundColor: "#ebebeb",
  },
  // CARTLIST
  orderBox: {
    backgroundColor: "#ffffff",
    border: "1px solid #e0e0e0",
    padding: "20px 40px",
    borderRadius: "20px",
    margin: "80px 0",
  },
  cartTitle: {
    fontSize: "25px",
    fontWeight: "bold",
    width: "100%",
    textAlign: "center",
  },
  orderTitle: {
    fontSize: "25px",
    fontWeight: "bold",
  },
  orderBtn: {
    color: "#000",
    borderColor: "#ccc",
  },
  orderTableHeader: {
    backgroundColor: "#fafafa",
    borderTop: "1px solid #ddd",
    borderBottom: "1px solid #ddd",
    " th, td": {
      textAlign: "center",
    },
  },
  cartListTableAlignment: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cartListTableImageSize: {
    width: "100px",
    height: "100px",
  },
  cartListTableStockPadding: {
    padding: "6px 5px",
  },
  cartListTableModifyBtn: {
    marginTop: "10px",
    textAlign: "center",
  },
  cartListSubText: {
    color: "#ccc",
    fontSize: "12px",
  },
  cartListFooterBox: {
    borderBottom: "0",
    padding: "24px 24px 0 0",
  },
  cartListFooterGuide: {
    display: "flex",
    alignItems: "center",
    color: "black",
    fontSize: "14px",
    width: "100%",
  },
  cartListFooterCostBox: {
    width: "100%",
    li: {
      height: "30px",
      padding: "2px 0",
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      div: {width: "120px"},
      textAlign: "right",
    },
  },
  cartListFooterBtnBox: {
    display: "flex",
    justifyContent: "space-around",
    width: "100%",
    button: {marginRight: "10px"},
  },
  cartListFooterBtnLeft: {
    width: "50%",
    display: "flex",
  },
  cartListFooterBtnRight: {
    width: "50%",
    display: "flex",
    justifyContent: "flex-end",
  },
  // ORDER SHEET
  orderSheetDiscount: {
    color: "#ccc",
  },
  orderSheetDiscountBeforeValue: {
    color: "#ccc",
    textDecoration: "line-through",
  },
  orderSheetBottomBox: {
    maxWidth: "1024px",
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    marginTop: "10px",
  },
  orderSheetDeliveryBox: {
    padding: "30px 40px",
    wordBreak: "break-all",
    display: "flex",
  },
  orderSheetPostBox: {
    marginTop: "5px",
    display: "flex",
    flexDirection: "column",

    flexGrow: "2",
    div: {
      display: "flex",
      padding: "0",
      fontSize: 14,
      alignItems: "center",
    },
  },
  orderSheetDeliveryInfoBox: {
    marginTop: "10px",
    flexGrow: "1",
    ".header": {
      width: "150px",
      display: "flex",
      alignItems: "center",
    },
    ".row": {
      display: "flex",
    },
  },
  orderSheetDeliveryInfoLayout: {
    ".MuiRadio-root": {
      padding: "0px",
    },
    display: "flex",
  },
  orderSheetBuyerInfoBox: {
    wordBreak: "break-all",
    padding: "15px 40px",
    ".header": {
      width: "150px",
      display: "flex",
      alignItems: "center",
    },
    ".row": {
      display: "flex",
    },
  },
  orderSheetBuyerInfoList: {
    fontSize: "16px",
    paddingBottom: "10px",
  },
  orderSheetPriceDetail: {
    display: "flex",
    fontSize: "12px",
    color: "#aaa",
    paddingLeft: "5px",
  },
  orderSheetOrderBtn: {
    width: "100%",
    backgroundColor: "#9ac66d !important",
    color: "#fff !important",
    textAlign: "center",
    padding: "10px",
    cursor: "pointer",
  },
  // RECENT DELIVERY DIV
  recentDeliveryBox: {
    margin: "0 auto",
    "> div": {
      width: "100%",
      maxWidth: "100%",
      margin: "0 auto",
    },
  },
  // ORDER SHEET
  orderSheetResultProductGridLayout: {
    borderTop: "2px solid black",
    margin: "20px 0",
    "> div": {
      display: "grid",
      gridGap: "10px",
      gridTemplateColumns: "3fr 1fr 1fr 1fr",
      textAlign: "center",
      borderBottom: "1px solid #eee",
      "> div ": {
        gridRow: 1,
        padding: "20px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    },
  },
  orderSheetResultInfoGridLayout: {
    borderTop: "2px solid black",
    margin: "20px 0",
    "> div": {
      display: "grid",
      gridGap: "10px",
      gridTemplateColumns: "1fr 3fr",
      textAlign: "center",
      borderBottom: "1px solid #eee",
      "> div ": {
        gridRow: 1,
        padding: "20px 0",
      },
    },
  },
};
