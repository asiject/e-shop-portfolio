import React, {useEffect, useState, useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Box, Button} from "@mui/material";

import {useProductQuery} from "@recoils/product/query";
import {Styles} from "@styles";
import ContentMenubar from "./ContentMenubar";
import ProductDetail from "./ProductDetail";
import {ProductsProduct, OrderedProduct} from "@utils/Types";
import Loading from "@layout/Loading";
import Error from "@layout/Error";
import NoImage from "components/shop/NoImage";
import ProductImages, {collectProductImages} from "components/shop/ProductImages";
import ProductEditorBody from "components/shop/ProductEditorBody";
import ProductQna from "components/shop/ProductQna";
import ProductTakeBack from "components/shop/ProductTakeBack";
import {numberFormat} from "@utils/Numaric";
import {kraft, lotLabel} from "theme/kraft";

export default function Product() {
  const [product, setProduct] = useState<ProductsProduct>();
  const [editor, setEditor] = useState("");
  const {productid} = useParams();
  const [imageList, setImageList] = useState<string[]>([]);
  const [optionList, setOptionList] = useState<Array<any>>([]);
  const [itemList, setItemList] = useState<Array<OrderedProduct>>([]);
  const [optionKeys, setOptionKeys] = useState<Array<string>>([]);
  const [optLen, setOptLen] = useState(0);
  const [selectList, setSelectList] = useState([]);
  const [packageMethod, setPackageMethod] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  const [isBuyOpen, setIsBuyOpen] = useState(false);
  const detailPage = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const styles = Styles();

  const {isLoading, isError, data, error} = useProductQuery(productid || "", {
    retry: 0,
    refetchOnWindowFocus: false,
    onSuccess: async (result: any) => {
      if (result?.data == null) {
        alert("데이터가 없습니다.");
        navigate("/");
        return;
      }
      await productFunc(result?.data);
    },
    onError: () => {},
  });

  useEffect(() => {
    const onScroll = () => {
      const top = detailPage.current?.offsetTop ?? 0;
      const next = window.scrollY > top;
      setIsSticky(next);
      if (!next) setIsBuyOpen(false);
    };
    window.addEventListener("scroll", onScroll, {passive: true});
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }

  async function productFunc(data: any) {
    setProduct({
      id: data?.id,
      title: data?.title,
      description: data?.description,
      thumbnail: data?.thumbnail,
      cost: Number(data?.cost),
      capacity: Number(data?.capacity),
      optionCnt: data?.optionCnt,
      showyn: data?.showyn,
      stock: 1,
    });
    setEditor(data?.editor || "");
    setImageList(collectProductImages(data));
    if (data.optionCnt > 0) {
      setOptLen(Number(data.optionCnt));
      setOptionKeys([...new Set<string>(data.options.map((r: any) => r.optkey))]);
      let options = data.options?.map((option: any) => {
        return {
          key: option.optkey,
          val: option.optvals,
        };
      });
      let items = data?.options[0]?.items?.map((item: any) => {
        return {
          itemid: item.itemid,
          key: item.itemkey,
          val: item.itemval,
          itemkey: item.itemkey.split(",")[0],
          itemval: item.itemkey.split(",")[1],
          cost: Number(data.cost) + Number(item.price),
          price: Number(item.price),
          capacity: Number(item.capacity),
          stock: 1,
        };
      });
      setOptionList(
        [...new Set<any>(options.map(JSON.stringify))].map((item: any) => {
          return JSON.parse(item);
        }),
      );
      if (items) {
        setItemList(
          [...new Set<OrderedProduct>(items?.map(JSON.stringify))].map((item: any) => {
            return JSON.parse(item);
          }),
        );
      }
    }
    window.scrollTo(0, 0);
  }

  const buyPanel = product && (
    <ProductDetail
      product={product}
      optLen={optLen}
      optionKeys={optionKeys}
      optionList={optionList}
      itemList={itemList}
      selectList={selectList}
      setSelectList={setSelectList}
      packageMethod={packageMethod}
      setPackageMethod={setPackageMethod}
      tabYn={false}
    />
  );

  return (
    <Box sx={styles.container}>
      <Box sx={styles.productBox}>
        <Box sx={styles.productLeft}>
          <ProductImages images={imageList} alt={product?.title || "상품"} />
        </Box>
        {buyPanel}
      </Box>

      <Box ref={detailPage}>
        <ContentMenubar />
        {isSticky && (
          <Box sx={styles.productTabContainer}>
            <Box>
              <Box sx={styles.tabThumbnail}>
                {product?.thumbnail ? <Box component={"img"} src={`${product.thumbnail}`} alt="" /> : <NoImage size="thumb" />}
              </Box>
              <Box sx={styles.tabInfo}>
                <Box>{product?.title}</Box>
                <Box>{numberFormat(product?.cost || 0)}</Box>
              </Box>
              <Box sx={styles.tabOpen}>
                <Button
                  variant={isBuyOpen ? "contained" : "outlined"}
                  onClick={() => setIsBuyOpen(open => !open)}
                  aria-expanded={isBuyOpen}>
                  {isBuyOpen ? "닫기" : "구매하기"}
                </Button>
              </Box>
            </Box>
            {isBuyOpen && product && (
              <ProductDetail
                product={product}
                optLen={optLen}
                optionKeys={optionKeys}
                optionList={optionList}
                itemList={itemList}
                selectList={selectList}
                setSelectList={setSelectList}
                packageMethod={packageMethod}
                setPackageMethod={setPackageMethod}
                tabYn={"Y"}
              />
            )}
            <ContentMenubar />
          </Box>
        )}
        <Box sx={{...styles.w100per, display: "flex", flexDirection: "column", gap: "28px", mt: "28px"}}>
          <Box
            id="info"
            sx={{
              backgroundColor: kraft.sticker,
              border: `2px solid ${kraft.ink}`,
              padding: "28px 24px",
            }}>
            <Box
              component="h2"
              sx={{
                m: 0,
                mb: 2,
                fontFamily: kraft.display,
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "-0.03em",
              }}>
              {product ? lotLabel(product.id) : "상세 정보"}
            </Box>
            <ProductEditorBody html={editor} />
          </Box>
          <ProductQna id="qna" productId={product?.id} />
          <ProductTakeBack id="takeback" />
        </Box>
      </Box>
    </Box>
  );
}
