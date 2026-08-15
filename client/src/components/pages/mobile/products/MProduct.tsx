import React, {useEffect, useState, useRef} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {Box, Button} from "@mui/material";

import {useProductQuery} from "@recoils/product/query";
import {numberFormat} from "@utils/Numaric";
import ContentMenubar from "./ContentMenubar";
import MProductDetail from "./MProductDetail";
import Loading from "@layout/Loading";
import Error from "@layout/Error";
import NoImage from "components/shop/NoImage";
import ProductImages, {collectProductImages} from "components/shop/ProductImages";
import ProductEditorBody from "components/shop/ProductEditorBody";
import ProductQna from "components/shop/ProductQna";
import ProductTakeBack from "components/shop/ProductTakeBack";
import {MStyles} from "@styles";
import {kraft, lotLabel} from "theme/kraft";

type Product = {
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
type OrderedProduct = {
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
export default function MProduct() {
  const [product, setProduct] = useState<Product>();
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
  const {isLoading, isError, data, error} = useProductQuery(productid || "", {
    refetchOnWindowFocus: false,
    retry: 0,
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
    if (data) {
      productFunc(data);
    }
  }, [data]);

  useEffect(() => {
    const onScroll = () => {
      const top = (detailPage.current?.offsetTop ?? 0) - 130;
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
    let result = data;
    setProduct({
      id: result.id,
      title: result.title,
      description: result.description,
      thumbnail: result.thumbnail,
      cost: Number(result.cost),
      capacity: Number(result.capacity),
      optionCnt: result.optionCnt,
      showyn: result.showyn,
      stock: 1,
    });
    setEditor(result.editor || "");
    setImageList(collectProductImages(result));
    if (result.optionCnt > 0) {
      setOptLen(Number(result.optionCnt));
      setOptionKeys([...new Set<string>(result.options.map((r: any) => r.optkey))]);
      let options = result.options.map((option: any) => {
        return {
          key: option.optkey,
          val: option.optvals,
        };
      });
      let items = result?.options[0]?.items?.map((item: any) => {
        return {
          itemid: item.itemid,
          key: item.itemkey,
          val: item.itemval,
          itemkey: item.itemkey.split(",")[0],
          itemval: item.itemkey.split(",")[1],
          cost: Number(result.cost) + Number(item.price),
          price: Number(item.price),
          capacity: Number(item.capacity),
          stock: 1,
        };
      });
      setOptionList(
        [...new Set<any>(options?.map(JSON.stringify))]?.map((item: any) => {
          return JSON.parse(item);
        }),
      );
      setItemList(
        [...new Set<OrderedProduct>(items?.map(JSON.stringify))]?.map((item: any) => {
          return JSON.parse(item);
        }),
      );
    }
    window.scrollTo(0, 0);
  }

  return (
    <Box sx={MStyles.container}>
      <Box sx={MStyles.productBox}>
        <Box sx={MStyles.productImageArea}>
          <ProductImages images={imageList} alt={product?.title || "상품"} />
        </Box>
        {product && (
          <MProductDetail
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
        )}
      </Box>
      <ContentMenubar />
      <Box ref={detailPage}>
        {isSticky && (
          <Box sx={MStyles.productTabContainer}>
            <Box>
              <Box sx={MStyles.tabThumbnail}>
                {product?.thumbnail ? <Box component={"img"} src={`${product.thumbnail}`} alt="" /> : <NoImage size="thumb" />}
              </Box>
              <Box sx={MStyles.tabInfo}>
                <Box>{product?.title}</Box>
                <Box>{numberFormat(product?.cost || 0)}</Box>
              </Box>
              <Box sx={MStyles.tabOpen}>
                <Button
                  variant={isBuyOpen ? "contained" : "outlined"}
                  onClick={() => setIsBuyOpen(open => !open)}
                  aria-expanded={isBuyOpen}>
                  {isBuyOpen ? "닫기" : "구매하기"}
                </Button>
              </Box>
            </Box>
            {isBuyOpen && product && (
              <Box sx={{px: 2, pb: 2}}>
                <MProductDetail
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
              </Box>
            )}
          </Box>
        )}
        <Box sx={{...MStyles.detailPage, display: "flex", flexDirection: "column", gap: "16px", px: 0}}>
          <Box
            id="info"
            sx={{
              backgroundColor: kraft.sticker,
              border: `2px solid ${kraft.ink}`,
              padding: "28px 16px",
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
        {isSticky && <Box sx={{height: "72px"}} aria-hidden="true" />}
      </Box>
    </Box>
  );
}
