import React, {useEffect, useState, useRef} from "react";
import {Navigate, useNavigate, useParams} from "react-router-dom";
// import {Carousel} from "react-carousel-minimal";
import {Carousel} from "@sefailyasoz/react-carousel";
import {useRecoilState} from "recoil";

import {Box, Button} from "@mui/material";

import {getProductQuery} from "@recoils/product/query";
import {Styles} from "@styles";
import ContentMenubar from "./ContentMenubar";
import Qna from "./Qna";
import TakeBack from "./TakeBack";
import ProductDetail from "./ProductDetail";
import {ProductsProduct, ThumbnailImage, OrderedProduct} from "@utils/Types";
import Loading from "@layout/Loading";
import Error from "@layout/Error";
import {numberFormat} from "@utils/Numaric";

export default function Product() {
  const [product, setProduct] = useState<ProductsProduct>();
  const {productid} = useParams();
  const [imageList, setImageList] = useState<Array<ThumbnailImage>>([]);
  const [optionList, setOptionList] = useState<Array<any>>([]);
  const [itemList, setItemList] = useState<Array<OrderedProduct>>([]);
  const [optionKeys, setOptionKeys] = useState<Array<string>>([]);
  const [optLen, setOptLen] = useState(0);
  const [selectList, setSelectList] = useState([]);
  const [packageMethod, setPackageMethod] = useState("");
  const [totalStock, setTotalStock] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const productTabContainer = useRef<HTMLElement>();
  const detailPage = useRef<HTMLElement>();
  const showEasyToBuy = useRef<HTMLElement>();
  const openBtn = useRef<HTMLElement>();
  const closeBtn = useRef<HTMLElement>();
  const navigate = useNavigate();
  const styles = Styles();

  const {isLoading, isError, data, error} = getProductQuery(productid || "", {
    retry: 0,
    refetchOnWindowFocus: false,
    onSuccess: async (result: any) => {
      //api 호출 성공
      if (result?.data == null) {
        alert("데이터가 없습니다.");
        navigate("/");
      } else {
        await productFunc(result?.data);
      }
    },
    onError: () => {},
  });

  const tabInit = () => {
    showEasyToBuy.current!.style.display = "none";
    closeBtn.current!.style.display = "none";
    openBtn.current!.style.display = "block";
  };
  window.addEventListener("scroll", e => {
    const value = window.scrollY;
    if (detailPage.current != null) {
      const boxTop = detailPage.current.offsetTop;
      if (value > boxTop) {
        productTabContainer.current!.style.display = "flex";
      } else if (value <= boxTop) {
        productTabContainer.current!.style.display = "none";
        tabInit();
      }
    }
  });
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }
  async function productFunc(data: any) {
    // console.log("result : ", result);
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
    if (data?.thumbnail) {
      let thumbImage: ThumbnailImage = {image: ""};
      let imagePaths: Array<ThumbnailImage> = [];
      if (data?.thumbnail) {
        let host = window.location.protocol + "//" + window.location.hostname;
        if (window.location.port) {
          host += ":" + window.location.port;
        }
        host += data.thumbnail;
        thumbImage = {image: host};
      }
      if (data.images) {
        imagePaths = [
          ...new Set<ThumbnailImage>(
            data.images.map(({path}: any) => {
              return {image: path};
            }),
          ),
        ];
      }
      imagePaths.length > 0 ? setImageList([thumbImage, ...imagePaths]) : setImageList([thumbImage]);
      // product optionCnt가 1(개)이상일 경우
      if (data.optionCnt > 0) {
        setOptLen(Number(data.optionCnt));
        setOptionKeys([...new Set<string>(data.options.map((r: any) => r.optkey))]);
        let options = data.options?.map((option: any) => {
          return {
            key: option.optkey,
            val: option.optvals,
          };
        });
        //FIXME: ?? 왜 0번 idx 고정임?
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
    }
    window.scrollTo(0, 0);
  }

  return (
    <Box sx={styles.container}>
      <Box sx={styles.productBox}>
        <Box sx={styles.productLeft}>
          {imageList.length > 0 ? (
            <Carousel
              data={imageList}
              animationDuration={5000}
              // captionPosition="bottom"
              // automatic={true}
              // pauseIconColor="white"
              // pauseIconSize="40px"
              // slideImageFit="cover"
              // thumbnails={true}
              // thumbnailWidth="100px"
            />
          ) : (
            <Box />
          )}
        </Box>
        {product && (
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
            totalCost={totalCost}
            setTotalCost={setTotalCost}
            totalStock={totalStock}
            setTotalStock={setTotalStock}
            tabYn={false}
          />
        )}
      </Box>

      <Box ref={detailPage}>
        <ContentMenubar />
        <Box ref={productTabContainer} sx={styles.productTabContainer}>
          <Box>
            {/* FIXME: NoImage 처리 필요 */}
            <Box sx={styles.tabThumbnail}>{product?.thumbnail && <Box component={"img"} src={`${product?.thumbnail}`} />}</Box>
            <Box sx={styles.tabInfo}>
              <Box>
                <strong>{product?.title}</strong>
              </Box>
              <Box>
                <strong>{numberFormat(product?.cost || 0)}</strong>
              </Box>
            </Box>
            <Box sx={styles.tabOpen}>
              <Box ref={openBtn}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    showEasyToBuy.current!.style.display = "block";
                    closeBtn.current!.style.display = "block";
                    openBtn.current!.style.display = "none";
                  }}>
                  구매하기
                </Button>
              </Box>
              <Box ref={closeBtn}>
                <Button
                  variant="outlined"
                  sx={{display: "none"}}
                  onClick={() => {
                    showEasyToBuy.current!.style.display = "none";
                    closeBtn.current!.style.display = "none";
                    openBtn.current!.style.display = "block";
                  }}>
                  X
                </Button>
              </Box>
            </Box>
          </Box>
          <Box ref={showEasyToBuy} sx={{display: "none"}}>
            {product && (
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
                totalCost={totalCost}
                setTotalCost={setTotalCost}
                totalStock={totalStock}
                setTotalStock={setTotalStock}
                tabYn={"Y"}
              />
            )}
          </Box>
          <ContentMenubar />
        </Box>
        <Box sx={styles.w100per}>
          {/* TODO: 아래 스타일은 지워질 정보 */}
          <Box id="info" sx={{height: "600px"}}>
            상품페이지
          </Box>
          <Qna id="qna" />
          <TakeBack id="takeback" />
        </Box>
      </Box>
    </Box>
  );
}
