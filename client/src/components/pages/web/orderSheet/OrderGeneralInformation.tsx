import {useState, useEffect, useRef, SetStateAction} from "react";
import {useForm, Controller} from "react-hook-form";

import {Box, Button, Checkbox, FormControlLabel, Radio, RadioGroup, TextField} from "@mui/material";

import {useRecentDestinationQuery} from "@recoils/order/query";
import {numberFormat} from "@utils/Numaric";
import PostCode from "@thirdparty/postcode/PostCode";
import RecentDelivery from "./div/RecentDelivery";
import Loading from "@layout/Loading";
import Error from "@layout/Error";
import {User, FormValues} from "@utils/Types";
import {Styles} from "@styles";

export default function OrderGeneralInformation({
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
  const addAddress = useRef(false);
  const selectAddress = useRef(false);
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

  const {isLoading, isError, data, error, refetch} = useRecentDestinationQuery(user?.userid);

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
                    control={
                      <Checkbox
                        onClick={() => {
                          addAddress.current = !addAddress.current;
                        }}
                        {...register("addAddress")}
                      />
                    }
                    label="배송지 목록에 추가"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        onClick={() => {
                          selectAddress.current = !selectAddress.current;
                        }}
                        {...register("selectAddress")}
                      />
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
