import {useState, useEffect, useRef, SetStateAction} from "react";
import {useRecoilValue} from "recoil";
import {useParams, useNavigate} from "react-router-dom";
import {useForm, Controller} from "react-hook-form";
import {IMaskInput} from "react-imask";

import {Box, Button, Checkbox, FormControlLabel, Radio, RadioGroup, Table, TableBody, TableCell, TableHead, TableRow, TextField} from "@mui/material";

import {userState} from "@recoils/user/state";
import {getOrderSheetQuery, getRecentDestinationQuery} from "@recoils/order/query";
import {execute} from "@utils/Executor";
import {numberFormat} from "@utils/Numaric";
import PostCode from "@thirdparty/postcode/PostCode";
import RecentDelivery from "./div/RecentDelivery";
import Loading from "@layout/Loading";
import Error from "@layout/Error";
import {User, FormValues} from "@utils/Types";
import {Styles} from "@styles";
export default function OrderSheetList() {
  const {id} = useParams();
  const loginUser = useRecoilValue(userState);
  const [orderSheet, setOrderSheet] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [deliveryCost, setDeliveryCost] = useState(3000);
  const styles = Styles();
  const navigate = useNavigate();
  const {isLoading, isError, data, error} = getOrderSheetQuery({userid: loginUser?.userid, orderid: id || ""});

  console.log("data >", data);
  useEffect(() => {
    //FIXME: [SHOP-17] 비회원과 회원에 대한 방법
    if (loginUser) {
      if (data) {
        const products = data?.products;
        console.log("products >", products);
        if (products?.length > 0) {
          setOrderSheet(
            products?.map((product: any) => {
              return {
                productid: product.productid,
                title: product.product.title,
                thumbnail: product.product.thumbnail,
                option: product.option,
                count: product.count,
                cost: product.cost,
              };
            }),
          );
          setTotalCost(
            products?.map((product: any) => product.count * product.cost).reduce((prevCost: number, nextCost: number) => prevCost + nextCost),
          );
        }
      }
    } else {
      navigate("/login");
    }
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }

  // TODO: 직접수령 클릭하면 배송지 주소 대신 수령 주소로 변경
  // TODO: 직접수령하면 수령 예정일을 적는 게 나을까?

  // TODO: 기본 배송지가 없을 때 기본 배송지 설정 ~ 처음 기본 배송지 설정 => DB에서 기본 배송지를 어떻게 구분할까?
  // 1) 기본 배송지가 없을 때 -> 현재 등록하는 주소가 기본 배송지로 설정
  // 2) 신규 배송지로 설정하면 -> 신규 배송지 정보 등록
  // TODO: 목록 중에 기본 배송지 설정하기

  // TODO: 입력 정보 required 처리 받기 (axios.post / param)
  // [필수 체크] 수령인, 전화번호, 우편 번호, 배송지 기본 주소(주소1), 배송지 상세 주소(주소2)
  // 배송 메모(선택)

  // TODO:  페이공제 require => 계좌입금을 누르면 페이공제 require 비활성화 |결제수단 1. 페이공제 -> 이름, 간사번호 /  2. 계좌 입금 (배송비 포함 금액)

  // TODO:결제 수단 누르는 것에 따라 article 활성화 => UI도 신경써야함
  // 배송비 활성화 / 비활성화
  // 페이공제 정보 입력창 활성화 / 비활성화

  return (
    <Box sx={styles.orderWrapper}>
      <Box sx={styles.container}>
        <Box sx={styles.orderBox}>
          <Box sx={styles.orderTitle}>주문/결제</Box>
          <Table sx={styles.mt20}>
            <TableHead>
              <TableRow sx={styles.orderTableHeader}>
                <TableCell sx={styles.w550c}>상품정보</TableCell>
                <TableCell sx={styles.w100c}>옵션</TableCell>
                <TableCell sx={styles.w50c}>수량</TableCell>
                <TableCell sx={styles.w50c}>할인</TableCell>
                {/* <TableCell sx={styles.w100c}>상품금액</TableCell> */}
                <TableCell sx={styles.w100c}>총금액</TableCell>
                {/* <TableCell sx={styles.w100c}>배송비</TableCell> */}
              </TableRow>
            </TableHead>
            {orderSheet.map((order, i) => {
              return <OrderedList key={i} order={order} />;
            })}
          </Table>
        </Box>
        <OrderGeneralInformation deliveryCost={deliveryCost} setDeliveryCost={setDeliveryCost} user={loginUser} totalCost={totalCost} />
      </Box>
    </Box>
  );
}

function OrderedList({order}: {order: any}) {
  const styles = Styles();
  const option = order.option.split("/");
  return (
    <TableBody>
      <TableRow>
        <TableCell sx={{display: "flex"}}>
          <Box>
            <Box component="img" src={order.thumbnail} sx={{width: "100px", marginRight: "16px"}} />
          </Box>
          <Box sx={{display: "flex", alignItems: "center"}}>{order.title}</Box>
        </TableCell>
        <TableCell sx={styles.font12}>
          {option &&
            option.map((op: any, index: number) => {
              return <Box key={index}>{op}</Box>;
            })}
        </TableCell>
        <TableCell>
          <Box sx={{textAlign: "center"}}>{order.count}개</Box>
        </TableCell>
        <TableCell sx={styles.textCenter}>
          <Box sx={styles.orderSheetDiscount}>(-){numberFormat(0)}</Box>
        </TableCell>
        <TableCell sx={styles.textCenter}>
          <Box>{numberFormat(order.cost * order.count)}</Box>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}

function OrderGeneralInformation({
  deliveryCost,
  setDeliveryCost,
  user,
  totalCost,
}: {
  deliveryCost: number;
  setDeliveryCost: React.Dispatch<SetStateAction<number>>;
  user: User;
  totalCost: number;
}) {
  const styles = Styles();

  const [open, setOpen] = useState<boolean>(false);
  const [dOpen, setDOpen] = useState<boolean>(false);

  const paymentRef = useRef<HTMLElement>();
  const accountRef = useRef<HTMLElement>();
  const directReceivePositionRef = useRef<HTMLElement>();
  const [deliveryList, setDeliveryList] = useState([]);
  const [deliveryFromList, setDeliveryFromList] = useState<any>();
  const [sameReceiver, setSameReceiver] = useState(false);
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [postcode, setPostcode] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [addressNickname, setAddressNickname] = useState("");
  const [addAddress, setAddAddress] = useState(false);
  const [selectAddress, setSelectAddress] = useState(false);
  const [payname, setPayname] = useState("");
  const [paynumber, setPaynumber] = useState("");
  const NUMBERIC_DASH_REGEX = /^[0-9-]+$/;
  const NUMBERIC_REGEX = /^[0-9]+$/;
  const {
    register,
    handleSubmit,
    control,
    // formState: {errors},
    // } = useForm<FormValues>({defaultValues: {type: ""}});
  } = useForm<FormValues>({defaultValues: {type: ""}});

  const {isLoading, isError, data, error, refetch} = getRecentDestinationQuery(user?.userid);

  console.log("data 1234444>", data);

  useEffect(() => {
    console.log("data 2323>", data);
    // refetch();
    refInit();
    // setDeliveryList(data);
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }

  function refInit() {
    if (paymentRef.current && paymentRef.current?.style) paymentRef.current.style.display = "none";
    if (paymentRef.current && accountRef.current?.style) accountRef.current.style.display = "none";
    if (directReceivePositionRef.current && directReceivePositionRef.current?.style) directReceivePositionRef.current!.style.display = "none";
  }
  // const sameReceiverCheck = state => {
  //   setSameReceiver(!state);
  // };

  const isPost = (charge: number) => {
    if (charge == 3000) {
      setDeliveryCost(3000);
      directReceivePositionRef.current!.style.display = "none";
    } else {
      setDeliveryCost(0);
      directReceivePositionRef.current!.style.display = "block";
    }
  };
  const handleData = (data: any) => {
    setDeliveryFromList({});
    // zonecode = data.zonecode;
    // roadAddress = data.roadAddress;
    setPostcode(data.zonecode);
    setAddress1(data.roadAddress);
  };

  // const handleOrdered = async formData => {
  const handleOrdered = async (inputData: any) => {
    console.log("inputData >", inputData);
    /*
    await execute(async () => {
      const info = {
        buyername: user.username,
        buyerEmail: user.userid,
        buyerPhone: user.phone || "",
        price: totalCost,
        charge: deliveryCost,
        total: totalCost + deliveryCost,
      };
      const params = Object.assign(info, inputData);
      console.log("inputData >> ", inputData);
      console.log("params >> ", params);
      if (params.postcode == "") {
        console.log("zonecode is empty");
        return;
      }
      // orders payment, delivery, buyer 정보 받아서 저장
      //  const orderData = await axios.put(`/api/v1/user/${user.userid}/order/${id}/status`, params);
      {
        user && user.userid;
      }
      if (params.addAddress === true) {
        // user_address DB에 유저 배송지 저장
        // { alias : addressNickname, postcode, address1, address2, phone, userid}
        const address = {
          userid: user.userid,
          alias: params.addressNickname,
          postcode: params.postcode,
          address1: params.address1,
          address2: params.address2,
          phone: params.receiverPhone, // 받는 사람 연락처
        };
        //  const addressData = await axios.post(`/api/v1/user/${user.userid}/address`, address);
        // console.log("address Data : ", addressData.data);
      }
      // user_payment 에 페이공제 정보[장부명, 장부 번호] 저장
      // { alias : payname, sabun: paynumber, userid}
      const payment = {
        userid: user.userid,
        alias: params.payname,
        sabun: params.paynumber,
      };
      // const paymentData = await axios.post(`/api/v1/user/${user.userid}/payment`, payment);
      // console.log("paymentData >> ", paymentData);
      // 결과창으로 이동
      //  navigate(`/order/sheet/${orderid}/result`);
    });
    */
  };

  // [SHOP-18] 결재 배송지 정보처리
  return (
    <Box sx={styles.orderSheetBottomBox} component={"form"} onSubmit={handleSubmit(handleOrdered)}>
      {/* <Box sx={styles.orderSheetBottomBox}> */}
      <Box sx={styles.orderSheetDeliveryBox}>
        <Box sx={styles.orderSheetDeliveryInfoBox}>
          <Box sx={styles.orderTitle}>배송지 정보</Box>
          <Box className="row">
            <Box className="header">수령 방식</Box>
            <Box sx={styles.orderSheetDeliveryInfoLayout}>
              <Box>
                <RadioGroup row defaultValue={"post"}>
                  <FormControlLabel
                    value={"post"}
                    label={
                      <Box component={"span"} sx={styles.font14} onClick={() => isPost(3000)}>
                        택배
                      </Box>
                    }
                    control={<Radio size="small" onClick={() => isPost(3000)} />}
                  />
                  <FormControlLabel
                    value={"direct"}
                    label={
                      <Box component={"span"} sx={styles.font14} onClick={() => isPost(0)}>
                        직접수령
                      </Box>
                    }
                    control={<Radio size="small" onClick={() => isPost(0)} />}
                  />
                </RadioGroup>
              </Box>
              <Box ref={directReceivePositionRef}>서울시 백석동1길 11 2층 (빨간 지붕)</Box>
            </Box>
          </Box>
          <Box className="row">
            <Box className="header">수령인 정보 확인</Box>
            <Box sx={{"label span": {marginLeft: "-10px"}}}>
              <FormControlLabel
                control={
                  <Checkbox
                    onClick={() => {
                      // sameReceiverCheck(sameReceiver);
                      setSameReceiver(!sameReceiver);
                    }}
                  />
                }
                label={"주문 고객 정보와 동일"}
              />
            </Box>
          </Box>
          <Box className="row">
            <Box className="header">수령인 성명</Box>
            <Box>
              <TextField
                id="recvUser"
                variant="standard"
                {...register("receiver")}
                required
                value={sameReceiver ? user && user.username : username}
              />
            </Box>
          </Box>
          <Box className="row">
            <Box className="header">연락처</Box>
            <Box>
              <TextField
                id="recvNumber"
                variant="standard"
                inputMode="tel"
                {...register("receiverPhone")}
                onChange={e => {
                  if (e.target.value !== "" && !NUMBERIC_DASH_REGEX.test(e.target.value)) {
                    return;
                  }
                  setPhone(e.target.value);
                }}
                inputProps={{maxLength: 13}}
                required
                value={sameReceiver ? (user && user.phone == null ? "등록된 번호가 없습니다" : user.phone) : phone}
              />
            </Box>
          </Box>
          <Box className="row">
            <Box className="header">이메일</Box>
            <Box>
              <TextField
                id="recvEmail"
                variant="standard"
                inputMode="email"
                {...register("receiverEmail")}
                value={sameReceiver ? user && user.userid : email}
              />
            </Box>
          </Box>
          <Box className="row">
            <Box className="header">배송지 선택</Box>
            <Box sx={styles.orderSheetDeliveryInfoLayout}>
              <RadioGroup row>
                <FormControlLabel
                  value={"prev"}
                  label={
                    <Box component={"span"} sx={styles.font14}>
                      기본 배송지
                    </Box>
                  }
                  control={<Radio size="small" />}
                />
                <FormControlLabel
                  value={"new"}
                  label={
                    <Box component={"span"} sx={styles.font14}>
                      신규 배송지
                    </Box>
                  }
                  control={<Radio size="small" onClick={() => setDeliveryFromList(null)} />}
                />
              </RadioGroup>
              <Button
                variant="outlined"
                sx={styles.orderBtn}
                size="small"
                onClick={e => {
                  setDOpen(true);
                }}>
                배송지 목록
              </Button>
            </Box>
          </Box>
          <Box className="row">
            <Box className="header">배송지 이름</Box>
            <Box>
              <TextField
                id="addressNickname"
                variant="standard"
                {...register("addressNickname")}
                value={(deliveryFromList && deliveryFromList.alias) || addressNickname}
              />
            </Box>
          </Box>
          <Box className="row">
            <Box className="header">배송지 주소</Box>
            <Box>
              <Box sx={styles.orderSheetPostBox}>
                <Box sx={{display: "flex", marginLeft: "4px", span: {fontSize: 12}, "label span": {marginLeft: "-10px"}}}>
                  <FormControlLabel
                    control={<Checkbox onClick={() => (addAddress ? setAddAddress(false) : setAddAddress(true))} {...register("addAddress")} />}
                    label="배송지 목록에 추가"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox onClick={() => (selectAddress ? setSelectAddress(false) : setSelectAddress(true))} {...register("selectAddress")} />
                    }
                    label="기본 배송지로 선택"
                  />
                </Box>
                <Box sx={styles.flex}>
                  <TextField
                    id="zonecode"
                    variant="standard"
                    sx={{width: "100px", marginRight: "5px"}}
                    InputProps={{
                      readOnly: true,
                    }}
                    {...register("postcode")}
                    value={deliveryFromList ? deliveryFromList.postcode : postcode}
                    required
                  />
                  <Button
                    onClick={() => {
                      setOpen(true);
                    }}
                    variant="outlined"
                    size="small"
                    sx={{color: "#AAA"}}>
                    우편번호
                  </Button>
                </Box>
              </Box>
              <Box sx={styles.mt10}>
                <TextField
                  id="roadAddress"
                  variant="standard"
                  placeholder="주소"
                  sx={{width: "250px", marginRight: "5px"}}
                  {...register("address1")}
                  InputProps={{
                    readOnly: true,
                  }}
                  value={deliveryFromList ? deliveryFromList.address1 : address1}
                  required
                />
                <TextField
                  id="roadAddressDetails"
                  variant="standard"
                  placeholder="상세주소"
                  sx={{width: "150px", marginRight: "5px"}}
                  {...register("address2")}
                  value={deliveryFromList ? deliveryFromList.address2 : address2}
                  required
                />
              </Box>
            </Box>
          </Box>
          <Box className="row">
            <Box className="header">배송메모</Box>
            <Box>
              <TextField id="memo" variant="standard" placeholder="" sx={styles.w405} {...register("description")} />
            </Box>
          </Box>
        </Box>

        <Box sx={styles.orderSheetBuyerInfoBox}>
          <Box
            sx={{
              maxWidth: "400px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              "> div": {padding: "12px", borderBottom: "1px solid #ddd"},
              padding: "12px 0",
            }}>
            <Box>
              <Box>주문자 정보</Box>
              <Box sx={styles.font16}>
                <Box>{user.username}</Box>
                <Box>{user.userid}</Box>
                <Box>{user.phone}</Box>
              </Box>
            </Box>
            <Box>
              <Box>결제상세</Box>
              <Box sx={styles.flex}>
                <Box>주문금액</Box>
                <Box sx={styles.mlAuto}>{numberFormat(totalCost + deliveryCost)}</Box>
              </Box>
              <Box sx={styles.orderSheetPriceDetail}>
                <Box>ㄴ상품금액</Box>
                <Box sx={styles.mlAuto}>{numberFormat(totalCost)}</Box>
              </Box>
              <Box sx={styles.orderSheetPriceDetail}>
                <Box>ㄴ배송비</Box>
                <Box sx={styles.mlAuto}>{numberFormat(deliveryCost)}</Box>
              </Box>
            </Box>
            <Box className="row">
              <Box className="header">결제수단</Box>
              <Box>
                <Box sx={styles.orderSheetDeliveryInfoLayout}>
                  <Controller
                    rules={{required: true}}
                    control={control}
                    name="type"
                    render={({field}) => (
                      <RadioGroup row {...field}>
                        <FormControlLabel
                          value={"pay"}
                          label={
                            <Box component={"span"} sx={styles.font14}>
                              페이공제
                            </Box>
                          }
                          control={<Radio size="small" />}
                          onClick={e => {
                            paymentRef.current!.style.display = "block";
                            accountRef.current!.style.display = "none";
                          }}
                        />
                        <FormControlLabel
                          value={"account"}
                          label={
                            <Box component={"span"} sx={styles.font14}>
                              계좌입금
                            </Box>
                          }
                          control={<Radio size="small" />}
                          onClick={e => {
                            paymentRef.current!.style.display = "none";
                            accountRef.current!.style.display = "block";
                          }}
                        />
                      </RadioGroup>
                    )}
                  />
                </Box>
              </Box>
            </Box>
            <Box className="row" ref={paymentRef}>
              <Box sx={{maxWidth: "300px", minHeight: "100px"}}>
                <TextField variant="standard" {...register("payname")} label={"간사(장부) 이름"} />
                <TextField variant="standard" {...register("paynumber")} label={"간사(장부) 번호"} type="number" />
              </Box>
            </Box>
            <Box className="row" ref={accountRef}>
              <Box sx={{maxWidth: "300px", minHeight: "100px", display: "flex", alignItems: "center"}}>
                1. 주문하기 버튼을 클릭
                <br />
                2. 주문 완료 창 확인
                <br />
                3. 카카오뱅크 3333- ... 강다은으로 입금
                <br />
                4. 확인 후 상품을 보내드립니다.
              </Box>
            </Box>
          </Box>
          <Box>
            {/* <Button type="submit" sx={styles.orderSheetOrderBtn}> */}
            <Button
              sx={styles.orderSheetOrderBtn}
              type="submit"
              // onClick={() => {
              //   // console.log("control >>", control._fields);
              //   const params = {
              //     // 수령인 정보
              //     receiver: control._fields!.receiver!._f.ref.value,
              //     receiverEmail: control._fields!.receiverEmail!._f.ref.value,
              //     receiverPhone: control._fields!.receiverPhone!._f.ref.value,
              //     // 배송지 정보
              //     addressNickname: control._fields!.addressNickname!._f.ref.value,
              //     // TODO: 아래 두줄 object 형태 에러
              //     // addAddress: control!._fields!.addAddress!._f!.refs[0]!.checked,
              //     // selectAddress: control!._fields!.selectAddress!._f!.refs[0]!.checked,
              //     postcode: control._fields.postcode!._f.ref.value,
              //     address1: control._fields.address1!._f.ref.value,
              //     address2: control._fields.address2!._f.ref.value,
              //     description: control._fields.description!._f.ref.value,
              //     // 결제 방법
              //     status: control._fields.type!._f.value == "pay" ? "PAYMENT" : "WAIT",
              //     payname: control._fields.payname!._f.ref.value,
              //     paynumber: control._fields.paynumber!._f.ref.value,
              //   };
              //   console.log("params >", params);
              //   handleOrdered(params);
              // }}
            >
              주문하기
            </Button>
          </Box>
        </Box>
      </Box>

      <PostCode open={open} setOpen={setOpen} handleData={handleData} />
      <RecentDelivery open={dOpen} setOpen={setDOpen} deliveryList={deliveryList} setDeliveryFromList={setDeliveryFromList} />
    </Box>
  );
}
