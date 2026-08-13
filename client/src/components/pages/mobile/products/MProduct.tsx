import React, {useEffect, useState, useRef} from "react";
import {useParams, Link, useNavigate} from "react-router-dom";
import {useRecoilState} from "recoil";
// import {Carousel} from "react-carousel-minimal";
import {Carousel} from "@sefailyasoz/react-carousel";

import {Box, Button} from "@mui/material";

import {useProductQuery} from "@recoils/product/query";
import {numberFormat} from "@utils/Numaric";
import ContentMenubar from "./ContentMenubar";
import MProductDetail from "./MProductDetail";
import TakeBack from "./TakeBack";
import Qna from "./Qna";
import Loading from "@layout/Loading";
import Error from "@layout/Error";
import {MStyles} from "@styles";

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
type ThumbnailImage = {
  image: string;
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
  const {productid} = useParams();
  const [imageList, setImageList] = useState<Array<ThumbnailImage>>([]);
  const [optionList, setOptionList] = useState<Array<any>>([]);
  const [itemList, setItemList] = useState<Array<OrderedProduct>>([]);
  const [optionKeys, setOptionKeys] = useState<Array<string>>([]);
  const [optLen, setOptLen] = useState(0);
  const [selectList, setSelectList] = useState([]);
  const [packageMethod, setPackageMethod] = useState("");
  const productTabContainer = useRef<HTMLElement | null>();
  const detailPage = useRef<HTMLElement>();
  const showEasyToBuy = useRef<HTMLElement | null>();
  const openBtn = useRef<HTMLElement | null>();
  const closeBtn = useRef<HTMLElement | null>();

  const navigate = useNavigate();
  const {isLoading, isError, data, error} = useProductQuery(productid || "", {
    refetchOnWindowFocus: false,
    retry: 0,
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

  useEffect(() => {
    if (data) {
      productFunc(data);
      tabInit();
    }
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }

  const tabInit = () => {
    showEasyToBuy.current!.style.display = "none";
    closeBtn.current!.style.display = "none";
    openBtn.current!.style.display = "block";
  };
  window.addEventListener("scroll", e => {
    const value = window.scrollY;
    if (detailPage.current != null) {
      const boxTop = detailPage.current!.offsetTop - 130;
      if (detailPage) {
        if (value > boxTop) {
          productTabContainer.current!.style.display = "flex";
        } else if (value <= boxTop) {
          productTabContainer.current!.style.display = "none";
          tabInit();
        }
      }
    }
  });

  async function productFunc(data: any) {
    // console.log("result >> ", result);
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
    if (result.thumbnail) {
      let thumbImage: ThumbnailImage = {image: ""};
      let imagePaths: Array<ThumbnailImage> = [];
      if (result.thumbnail) {
        let host = window.location.protocol + "//" + window.location.hostname;
        if (window.location.port) {
          host += ":" + window.location.port;
        }
        host += result.thumbnail;
        thumbImage = {image: host};
      }
      if (result.images) {
        imagePaths = [
          ...new Set<ThumbnailImage>(
            result.images.map(({path}: any) => {
              return {image: path};
            }),
          ),
        ];
      }
      imagePaths.length > 0 ? setImageList([thumbImage, ...imagePaths]) : setImageList([thumbImage]);
      // product optionCnt 가 1 이상일 경우
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
    }
    window.scrollTo(0, 0);
  }
  return (
    <Box sx={MStyles.container}>
      <Box sx={MStyles.productBox}>
        <Box sx={MStyles.productImageArea}>
          {imageList.length > 0 ? (
            <Carousel
              data={imageList}
              animationDuration={5000}
              // time={5000}
              // captionPosition="bottom"
              // automatic={true}
              // pauseIconColor="white"
              // pauseIconSize="30px"
              // slideImageFit="cover"
              // dots={true}
            />
          ) : (
            <Box />
          )}
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
        <Box ref={productTabContainer} sx={MStyles.productTabContainer}>
          <Box>
            <Box sx={MStyles.tabThumbnail}>
              <Box component={"img"} src={`${product!.thumbnail}`} />
            </Box>
            <Box sx={MStyles.tabInfo}>
              <Box>
                <strong>{product!.title}</strong>
              </Box>
              <Box>
                <strong>{numberFormat(product!.cost)}</strong>
              </Box>
            </Box>
            <Box sx={MStyles.tabOpen}>
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
            )}
          </Box>
        </Box>
        <Box sx={MStyles.detailPage}>
          {/* height 500 은 지울 정보 */}
          <Box id="info" sx={{height: "500px"}}>
            상품페이지
          </Box>
          <Qna id="qna" />
          <TakeBack id="takeback" />
        </Box>
        <Box sx={{height: "43px"}}>&nbsp;</Box>
      </Box>
    </Box>
  );
}
