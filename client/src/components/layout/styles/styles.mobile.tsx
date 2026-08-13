const primaryColor = "#9ac66d";
export default {
  //MGnb
  mgnb: {
    width: "100%",
    display: "flex",
    height: "80px",
    flexDirection: "column",
    position: "sticky",
    backgroundColor: "#fff",
    top: 0,
    zIndex: "1000",
  },
  header: {
    width: "calc(100% - 16px)",
    height: "40px",
    display: "flex",
    justifyContent: "space-between",
    padding: "0 8px",
  },
  headerLeftBox: {
    width: "fit-content",
    display: "flex",
  },
  logo: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    a: {
      display: "flex",
      textAlign: "center",
      justifyContent: "center",
      alignItems: "center",
      textDecoration: "none",
      height: "100%",
      div: {
        display: "inline-block",
        width: "100%",
        // wordBreak: "nowrap",
        whiteSpace: "nowrap",
      },
    },
    img: {
      // width: 50,
      height: 32,
      marginTop: "6px",
    },
  },
  headerRightBox: {
    width: "108px",
    position: "relative",
    right: "-10px",
    display: "flex",
    alignContent: "flex-end",
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
  },
  icon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: "6px",
    svg: {
      cursor: "pointer",
      fontSize: 30,
      color: primaryColor,
    },
  },
  menubar: {
    width: "100%",
    height: "40px",
    backgroundColor: "#fff",
  },
  menulist: {
    display: "-webkit-box",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 0,
    width: "100%",
    height: "38px",
    borderTop: "1px solid #aaa",
    borderBottom: "1px solid #aaa",
    overflow: "auto",
    li: {
      display: "flex",
      alignItems: "center",
      height: "38px",
      margin: "0 2px",
      padding: "0 8px",
      fontWeight: 700,
      "&&::after": {
        width: "1px",
        height: "15px",
        backgroundColor: "black",
      },
      a: {
        color: "#000",
        textDecoration: "none",
      },
    },
  },
  // MMain
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    margin: "0 auto",
  },
  // COMMON
  none: {
    display: "none",
  },
  flex: {
    display: "flex",
  },
  font12: {fontSize: 12},
  font14: {fontSize: 14},
  font20: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  bold: {
    fontWeight: "bold",
  },
  w100per: {
    width: "100%",
  },
  w100perC: {
    width: "100%",
    textAlign: "center",
  },

  // COMMON - MCARD
  cardList: {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    li: {
      padding: "0 1%",
    },
  },
  card: {
    width: "48%",
    marginBottom: "2%",
    a: {
      textDecoration: "none",
    },
  },
  cardContent: {
    fontSize: "14px",
    width: "100%",
    img: {
      width: "100%",
    },
    "div strong": {
      color: "navy",
    },
  },
  cardInfo: {
    padding: "0 5%",
  },
  cardTitle: {
    // overflow: "hidden",
    // textOverflow: "ellipsis",
    // whiteSpace: "nowrap",
    // wordWrap: "normal",
    // wordBreak: "break-word",
    fontWeight: "bold",
    marginTop: "4px",
    color: "Black",
  },
  cardDesc: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    wordWrap: "normal",
    wordBreak: "break-word",
    fontSize: "12px",
    display: "-webkit-box",
    color: "#888",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    marginTop: "8px",
  },
  // PRODUCT
  productBox: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    // margin: "-1px 0 20px",
    border: "1px solid #ededed",
    backgroundColor: "#FFF",
  },
  productImageArea: {
    width: "100%",
    img: {
      marginLeft: "-2px",
    },
    "a:hover": {background: "none"},
  },
  purchasingArea: {
    width: "calc(100% - 32px)",
    padding: "16px 8px",
    margin: "0 auto",
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
    "button + button": {marginLeft: "5px"},
    a: {
      textDecoration: "none",
      display: "block",
      width: "100%",
    },
  },
  productOrderBtn: {
    flexGrow: 3,
    padding: 0,
    a: {
      color: "#FFF",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
    },
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
    width: "calc(100% - 48px)",
    borderTop: "1px solid #ddd",
    padding: "0 24px 20px",
    svg: {marginRight: "10px"},
  },
  //tab Product
  tabProduct: {
    width: "100%",
    border: "1px solid #dee0e2",
    // maxHeight: 275,
    overflowY: "auto",
    overflowX: "hidden",
    // padding: "0px 40px",
    display: "flex",
    "> div": {
      width: "100%",
      height: "fit-content",
      // padding: "10px",
    },
  },
  productInfoArea: {
    width: "100%",
    strong: {
      fontSize: "20px",
    },
  },
  stickyFlag: {},
  contentMenubar: {
    width: "100%",
    height: "40px",
    display: "flex",
    justifyContent: "space-around",
    borderBottom: "1px solid black",
    margin: "0 auto",
    position: "sticky",
    top: "80px",
    zIndex: 100,
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
  // productTabContainer
  productTabContainer: {
    display: "none",
    flexDirection: "column",
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    background: "#fff",
    zIndex: 110,
    "> ul": {width: "100%", borderBottom: 0},
    "> div": {
      display: "flex",
      borderTop: `1px solid ${primaryColor}`,
      justifyContent: "space-between",
      width: "100%",
      margin: "0 auto",
    },
  },
  tabThumbnail: {
    width: 50,
    display: "flex",
    alignItems: "center",
    img: {width: "100%"},
  },
  tabInfo: {
    margin: "8px 20px 0",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    div: {fontSize: "18px"},
    "div:last-child": {fontSize: "14px"},
  },
  tabOpen: {
    display: "flex",
    alignItems: "center",
    button: {
      height: "calc(100% + 1px)",
      borderRadius: 0,
      borderTop: "0 !important",
      marginTop: "1px",
    },
  },
  //product - detail
  detailPage: {width: "100%", ">div": {paddingTop: "120px"}},
  //product - qna - qnaEdit

  qnaContent: {
    borderTop: "1px solid #ddd",
    padding: "12px 24px",
  },
  qnaTextBox: {
    paddingTop: "12px",
  },
  qnaCancel: {
    width: "100%",
    textAlign: "center",
    height: "40px",
    lineHeight: "40px",
    border: "1px solid #ddd",
  },
  qnaAdd: {
    width: "100%",
    textAlign: "center",
    height: "40px",
    lineHeight: "40px",
    backgroundColor: "primary.main",
  },
  // takeback
  takeBack: {
    fontSize: "14px",
    thead: {
      borderTop: "solid black 1px",
    },
    td: {
      padding: "8px",
    },
    ol: {
      paddingInlineStart: "16px",
    },
    span: {
      fontSize: "12px",
      color: "#8f8f8f",
    },
  },
  // CATEGORY
  category: {
    margin: "0 auto",
  },
  categoryTitleBox: {
    display: "flex",
    marginTop: "50px",
    marginBottom: "13px",
    "> div": {
      fontSize: "22px",
      fontWeight: "bold",
    },
  },
  // CART
  MCartContainer: {
    width: "100%",
    backgroundColor: "#ebebeb",
  },
  MCartFormBox: {
    width: "100%",
    display: "flex",
    margin: "0 auto",
  },
  MCartBox: {
    width: "calc(100% - 40px)",
    backgroundColor: "#ffffff",
    padding: "20px",
    textAlign: "center",
  },
  MCartTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    paddingBottom: "12px",
  },
  MCartHeader: {
    width: "100%",
    display: "flex",
    marginBottom: "12px",
    fontSize: "12px",
    justifyContent: "space-between",
  },
  MCartGoodsStock: {
    border: "none",
    width: "50px",
    height: "30px",
    input: {
      padding: "4px 0 4px 0",
      textAlign: "center",
    },
  },
  MCartListTableStockPadding: {
    padding: "6px 5px",
  },
  MCartHeaderButtonBox: {
    width: "186px",
    display: "flex",
    justifyContent: "space-between",
    button: {
      width: "80px",
      color: "#aaa",
      borderColor: "#ccc",
      fontSize: "14px",
      padding: "0 8px",
      cursor: "pointer",
    },
  },
  MCartCardBox: {
    width: "100%",
    padding: "12px 0",
    display: "flex",
    flexWrap: "wrap",
    borderTop: "1px solid #000",
    borderBottom: "1px solid #000",
  },
  MCartCardProductLeft: {
    width: "30%",
    img: {
      width: "100px",
      height: "100px",
    },
  },
  MCartCardProductRight: {
    width: "calc(70% - 16px)",
    padding: "8px",
    display: "flex",
    textAlign: "left",
    flexDirection: "column",
  },

  MCartCardTitle: {
    width: "100%",
    paddingBottom: "8px",
    display: "flex",
    justifyContent: "space-between",
  },
  MCartSimpleCheckBox: {
    padding: 0,
    span: {padding: 0},
  },
  MCartCardSale: {
    textDecoration: "line-through",
  },
  MCartCardFinal: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "12px",
  },
  MCartCardStockBox: {
    display: "flex",
    justifyContent: "space-between",
  },
  MCartStockButtonBox: {
    border: "1px solid #e2e2e2",
    display: "flex",
  },
  MCartStockButton: {
    border: "none",
    width: "30px",
    height: "30px",
    minWidth: "0",
    fontSize: "20px",
  },
  MCartCardProductSelectInfo: {
    width: "100%",
    display: "flex",
  },
  MCartCardInfoLeft: {
    width: "70%",
    display: "flex",
    textAlign: "left",
    flexDirection: "column",
  },
  MCartCardInfoRight: {
    width: "30%",
  },
  MCartTotalCost: {
    padding: "20px 0",
    fontSize: "24px",
    fontWeight: "bold",
  },

  orderTitle: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  orderBtn: {
    color: "#000",
    borderColor: "#ccc",
  },
  // MOrderSheet
  orderSheet: {
    backgroundColor: "#ffffff",
    padding: "12px",
    h1: {
      width: "100%",
      fontSize: "24px",
      textAlign: "center",
      fontWeight: "bold",
      margin: "8px 0 20px",
    },
    "> ul": {
      width: "100%",
      borderTop: "1px solid #000",
      borderBottom: "1px solid #000",
      "> li": {
        width: "100%",
        display: "flex",
        padding: "8px 0",
        borderBottom: "1px solid #ccc",
      },
    },
  },
  orderLeft: {
    display: "flex",
    alignItems: "center",
    flex: 1,
    img: {width: "100%"},
  },
  orderRight: {
    flex: 3,
    textAlign: "right",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    h2: {
      fontSize: "16px",
      fontWeight: "bold",
      color: "#000",
      paddingBottom: "12px",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    ul: {
      li: {
        paddingBottom: "8px",
        fontSize: "14px",
        color: "#aaa",
      },
    },
  },
  orderSheetBottomBox: {
    background: "#f4f4f4",
    border: "1px solid #e0e0e0",
    borderRadius: "20px",
    display: "flex",
    marginTop: "10px",
  },
  orderSheetDeliveryBox: {
    width: "700px",
    backgroundColor: "#ffffff",
    borderRadius: "20px 0 0 20px",
    padding: "30px 40px",
    wordBreak: "break-all",
  },
  orderSheetPostBox: {
    marginTop: "5px",
    display: "flex",
    div: {
      display: "flex",
      padding: "0",
      fontSize: 14,
      alignItems: "center",
    },
  },
  orderSheetDeliveryInfoBox: {
    marginTop: "10px",
    ".header": {width: "150px", display: "flex", alignItems: "center"},
    ".row": {display: "flex"},
  },
  orderSheetDeliveryInfoLayout: {
    ".MuiRadio-root": {padding: "0px"},
    display: "flex",
  },
  orderSheetBuyerInfoBox: {
    width: "300px",
    wordBreak: "break-all",
    padding: "30px 40px",
  },
  orderSheetBuyerInfoList: {
    fontSize: "12px",
    borderBottom: "1px solid #ddd",
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
    marginTop: "20px",
    cursor: "pointer",
  },
  paymentMethod: {
    input: {
      border: "1px solid #aaa",
      borderRadius: "16px",
    },
    "div:before": {border: 0},
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

  orderProductsCost: {
    padding: "12px 0",
    div: {margin: "4px 0"},
    "> div": {
      display: "flex",
      justifyContent: "space-between",
      fontSize: "16px",
      fontWeight: "bold",
    },
  },
  deliveryBox: {
    borderTop: "1px solid rgba(224, 224, 224, 1)",
    td: {padding: "8px", borderBottom: "1px solid rgba(224, 224, 224, 1)"},
    input: {padding: "12px"},
    div: {width: "100%"},
  },
  deliveryHeader: {
    backgroundColor: "#efefef",
    td: {
      fontSize: "16px",
    },
  },
  leftCellSize: {width: "90px"},
  phoneBox: {
    display: "flex",
    input: {height: "1.4375rem", border: "1px solid rgba(0, 0, 0, 0.23)", borderRadius: "4px"},
  },
  postCodeBox: {
    display: "flex",
    alignItems: "center",
    "div, input": {width: "124px"},
  },
  postCode: {
    lineHeight: "1.5",
    padding: "12px",
    marginLeft: "12px",
  },
  buyerBtnBox: {
    width: "100%",
    textAlign: "center",
    button: {
      width: "90%",
      padding: "20px 5%",
      margin: "12px 0",
    },
  },
  orderTableHeader: {
    backgroundColor: "#fafafa",
    borderTop: "1px solid #ddd",
    borderBottom: "1px solid #ddd",
    " th, td": {
      textAlign: "center",
    },
  },
  // MOrderSheetResult
  MOrderResultGuide: {
    borderTop: "2px solid black",
    borderBottom: "2px solid black",
    padding: "20px 0",
  },
  MOrderResultBox: {
    borderBottom: "2px solid black",
    padding: "20px 0",
    "> div": {
      marginBottom: "20px",
    },
  },
  MOrderResultDivisionLine: {
    borderTop: "2.5px solid rgba(224, 224, 224, 1)",
  },
  MOrderResultLastButton: {
    width: "100%",
    padding: "8px",
    borderRadius: "0",
  },
  MOrderResultListItem: {
    borderTop: "1px solid #efefef",
    borderBottom: "1px solid #efefef",
    padding: "12px 0",
    margin: "0 !important",
  },
  MOrderResultListItemTitle: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  MOrderResultListItemOption: {
    display: "flex",
    div: {marginRight: "8px", fontSize: "0.875rem"},
  },
  // MOrderList
  oneLine: {
    wordBreak: "nowrap",
    textOverflow: "clip",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  MOrderListAddButton: {
    backgroundColor: "#ddd",
    margin: "20px 0",
    padding: "15px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  MOrderListItemBox: {
    margin: "4px 0 4px",
  },
  MOrderListItemBoxHeader: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "2px solid black",
  },
  MOrderListIndividualProduct: {
    padding: "16px 0",
    borderBottom: "1px solid #efefef",
    display: "flex",
  },
  // MOrderDetail
  MOrderDetailBox: {
    margin: "20px 0",
  },
  MOrderDetailItemBox: {
    display: "flex",
    margin: "4px 0 4px",
    borderBottom: "1px solid #ddd",
  },
  MOrderDetailTableHeader: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
    background: "#91a37e",
    color: "white",
  },
  MOrderDetailBoxHeader: {
    fontSie: "24px",
    fontWeight: "bold",
    margin: "0 0 12px 12px",
    table: {
      borderTop: "2px solid black",
    },
  },
};
