const primaryColor = "#1A120B";
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
      borderBottom: "2px solid #1A120B",
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
    fontFamily: '"Archivo Narrow", "Noto Sans KR", sans-serif',
    fontSize: "22px",
    fontWeight: 700,
    letterSpacing: "0.06em",
    color: "#1A120B",
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
    padding: "0 10px",
    boxSizing: "border-box",
    a: {textDecoration: "none"},
  },
  cardContent: {
    fontSize: "14px",
    width: "100%",
    img: {width: "226px", height: "226px", display: "block", margin: "0 auto"},
    "div strong": {
      color: "#1A120B",
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
    fontFamily: '"Archivo Narrow", "Noto Sans KR", sans-serif',
    letterSpacing: "0.06em",
    color: "#1A120B",
  },
  // ListView
  listViewBox: {
    display: "flex",
    flexDirection: "column",
  },
  // PRODUCT
  productBox: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(320px, 420px)",
    margin: "40px auto 28px",
    border: "2px solid #1A120B",
    backgroundColor: "#F3E6C9",
  },
  productLeft: {
    minWidth: 0,
    "a:hover": {background: "none"},
  },
  productRight: {
    minWidth: 0,
    padding: "28px 24px",
    borderLeft: "2px solid #1A120B",
  },
  productPrice: {
    margin: "8px 0 0",
    fontFamily: '"Spline Sans Mono", ui-monospace, monospace',
    fontSize: "22px",
    fontWeight: 600,
    fontVariantNumeric: "tabular-nums",
  },
  productTotalValues: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    margin: "16px 0 0",
    paddingTop: "16px",
    borderTop: "2px solid #1A120B",
  },
  productStock: {
    fontSize: "14px",
    color: "#4A341F",
    fontFamily: '"Spline Sans Mono", ui-monospace, monospace',
    fontVariantNumeric: "tabular-nums",
  },
  productCost: {
    fontFamily: '"Spline Sans Mono", ui-monospace, monospace',
    fontSize: "22px",
    fontWeight: 600,
    fontVariantNumeric: "tabular-nums",
    color: "#1A120B",
  },
  productBtnArea: {
    marginTop: "16px",
    display: "flex",
    gap: "8px",
  },
  productOrderBtn: {
    flex: 2,
  },
  productCartBtn: {
    flex: 1,
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
    width: 1024,
    maxHeight: 320,
    overflowY: "auto",
    overflowX: "hidden",
    padding: "16px 24px",
    display: "flex",
    backgroundColor: "#F3E6C9",
    borderTop: "2px solid #1A120B",
    "> div": {
      width: "100%",
      height: "fit-content",
    },
  },
  productInfoArea: {
    width: "100%",
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
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    borderBottom: "2px solid #1A120B",
    backgroundColor: "#F3E6C9",
    zIndex: 110,
    "> ul": {width: 1024, borderBottom: 0},
    "> div": {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "1024px",
      margin: "12px auto",
    },
  },
  tabThumbnail: {
    width: 50,
    height: 50,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "#2A1A10",
    img: {width: "100%", height: "100%", objectFit: "cover"},
  },
  tabInfo: {
    width: "calc(100% - 180px)",
    margin: "0 20px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    "div:first-of-type": {fontSize: "15px", fontWeight: 800, lineHeight: 1.3},
    "div:last-child": {
      fontFamily: '"Spline Sans Mono", ui-monospace, monospace',
      fontSize: "14px",
      fontVariantNumeric: "tabular-nums",
    },
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
    border: "2px solid #1A120B",
    borderBottomWidth: "2px",
    position: "sticky",
    margin: "0 auto",
    zIndex: 100,
    top: 0,
    backgroundColor: "#F3E6C9",
    listStyle: "none",
    padding: 0,
    button: {
      width: "100%",
      height: "100%",
      textDecoration: "none",
      padding: "12px 0",
      color: "#1A120B",
      fontWeight: 700,
    },
    li: {
      width: "100%",
      textAlign: "center",
      backgroundColor: "#F3E6C9",
      borderRight: "2px solid #1A120B",
      "&:last-child": {borderRight: 0},
    },
  },
  // TackBack 반품 정보
  takeBack: {
    fontSize: "14px",
    thead: {
      borderTop: "solid #1A120B 2px",
    },
    ol: {
      paddingInlineStart: "16px",
    },
    span: {
      fontSize: "12px",
      color: "#4A341F",
    },
  },
  // CARTLIST + ORDER
  orderWrapper: {
    backgroundColor: "#B48445",
  },
  // CARTLIST
  orderBox: {
    backgroundColor: "#F3E6C9",
    border: "2px solid #1A120B",
    padding: "20px 40px",
    borderRadius: 0,
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
    backgroundColor: "#F3E6C9",
    borderRadius: 0,
    marginTop: "10px",
    border: "2px solid #1A120B",
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
    backgroundColor: "#1A120B !important",
    color: "#F3E6C9 !important",
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
