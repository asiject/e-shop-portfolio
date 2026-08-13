import React, {useState, useEffect, useRef} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {useParams, useNavigate} from "react-router-dom";
import {useForm, Controller} from "react-hook-form";
import {IMaskInput} from "react-imask";
import axios from "axios";

import {Box, Button, FormControlLabel, Radio, RadioGroup, Table, TableBody, TableCell, TableRow, TextField, Checkbox} from "@mui/material";

import {userState} from "@recoils/user/state";
import {useOrderSheetQuery, useRecentDestinationQuery} from "@recoils/order/query";
import {execute} from "@utils/Executor";
import {numberFormat} from "@utils/Numaric";
import PostCode from "@thirdparty/postcode/PostCode";
import RecentDelivery from "./div/RecentDelivery";
import {Product, User, FormValues, DeleveryData} from "@utils/Types";
import Loading from "@layout/Loading";
import Error from "@layout/Error";
import {MStyles} from "@styles";
import MOrderSheetProducts from "./MOrderSheetProducts";

export default function MOrderSheetList() {
  const {id} = useParams();
  const [open, setOpen] = useState(false);
  const [orderSheet, setOrderSheet] = useState([]);
  const [deliveryList, setDeliveryList] = useState([]);
  const [deliveryFromList, setDeliveryFromList] = useState<DeleveryData>();
  const [totalCost, setTotalCost] = useState(0);
  const [deliveryCost, setDeliveryCost] = useState(3000);
  const [postcode, setPostcode] = useState("");
  const [address, setAddress] = useState("");

  let zonecode: string;
  let roadAddress: string;
  //
  const navigate = useNavigate();
  const loginUser = useRecoilValue(userState);

  const [sameReceiver, setSameReceiver] = useState(false);
  const [dOpen, setDOpen] = useState(false);
  const paymentRef = useRef<HTMLElement>();
  const accountRef = useRef<HTMLElement>();
  const directReceivePositionRef = useRef<HTMLElement>();
  const [phone, setPhone] = useState("");
  const [copyReceiver, setCopyReceiver] = useState<User>();
  const NUMBERIC_DASH_REGEX = /^[0-9-]+$/;

  const {isLoading, isError, data, error} = useOrderSheetQuery({userid: loginUser?.userid, orderid: id || ""});

  const result = useRecentDestinationQuery(loginUser?.userid);
  const {
    register,
    handleSubmit,
    control,
    // formState: {errors},
  } = useForm<FormValues>();

  useEffect(() => {
    if (loginUser) {
      if (data) {
        orderSheetFunc(loginUser, data);
        recentDevlieryFunc(result.data);
      }
    } else {
      navigate("/login");
    }
  }, [data, loginUser, navigate]);

  useEffect(() => {
    if (loginUser) {
      refInit();
    }
  }, [loginUser]);

  if (isLoading || result.isLoading) {
    return <Loading />;
  }
  if (isError || result.isError) {
    return <Error error={error} />;
  }

  async function orderSheetFunc(loginUser: User | null, data: any) {
    const result = data;
    const {products} = result;
    setOrderSheet(
      products.map((product: Product) => {
        //FIXME: product type 설정
        console.log("product : ", product);
        return {
          productid: product.productid,
          title: product.title,
          thumbnail: product.thumbnail,
          // title: product.product.title,
          // thumbnail: product.product.thumbnail,
          option: product.option,
          count: product.count,
          cost: product.cost,
        };
      }),
    );
    if (products?.length > 0) {
      setTotalCost(
        products?.map((product: any) => product.count * product.cost)?.reduce((prevCost: number, nextCost: number) => prevCost + nextCost),
      );
    } else {
      setTotalCost(0);
    }
  }
  async function recentDevlieryFunc(data: any) {
    setDeliveryList(data);
  }

  const handleData = (data: any) => {
    setDeliveryFromList(undefined);
    // zonecode.value = data.zonecode;
    // roadAddress.value = data.roadAddress;
    setPostcode(data.zonecode);
    setAddress(data.roadAddress);
  };

  const handleOrdered = async (formData: any) => {
    console.log("formData >> ", formData);
    await execute(async () => {
      const info = {
        status: formData.type == "pay" ? "PAYMENT" : "WAIT",
        buyername: loginUser.username,
        buyerEmail: loginUser.userid,
        buyerPhone: loginUser.phone,
        price: totalCost,
        charge: deliveryCost,
        total: totalCost + deliveryCost,
        postcode: postcode,
        address1: address,
      };
      const params = Object.assign(info, formData);
      // console.log("params & formData >>>", params);
      if (params.postcode == "") {
        console.log("zonecode is empty");
        return;
      }
      // orders payment, delivery, buyer 정보 받아서 저장
      const orderData = await axios.put(`/api/v1/user/${loginUser.userid}/order/${id}/status`, params);
      console.log("order data : ", orderData.data);
      if (params.addAddress === true) {
        // user_address DB에 유저 배송지 저장
        // { alias : addressNickname, postcode, address1, address2, phone, userid}
        const address = {
          userid: loginUser.userid,
          alias: params.addressNickname,
          postcode: params.postcode,
          address1: params.address1,
          address2: params.address2,
          phone: params.receiverPhone, // 받는 사람 연락처
        };
        // console.log("address >> ", address);
        const addressData = await axios.post(`/api/v1/user/${loginUser.userid}/address`, address);
        console.log("address Data : ", addressData.data);
      }
      // user_payment 에 페이공제 정보[장부명, 장부 번호] 저장
      // { alias : payname, sabun: paynumber, userid}
      const payment = {
        userid: loginUser.userid,
        alias: params.payname,
        sabun: params.paynumber,
      };
      // console.log("payment >> ", payment);
      const paymentData = await axios.post(`/api/v1/user/${loginUser.userid}/payment`, payment);
      console.log("paymentData >> ", paymentData);
      // 결과창으로 이동
      navigate(`/order/sheet/${id}/result`);
    });
  };

  const copyReceiverInfo = () => {
    setCopyReceiver({
      userid: loginUser.userid,
      username: loginUser.username,
      phone: loginUser.username,
    });
  };

  function refInit() {
    if (paymentRef.current && paymentRef.current?.style) paymentRef.current.style.display = "none";
    if (paymentRef.current && accountRef.current?.style) accountRef.current.style.display = "none";
    if (directReceivePositionRef.current && directReceivePositionRef.current?.style) directReceivePositionRef.current!.style.display = "none";
  }

  const isPost = (charge: number) => {
    if (charge == 3000) {
      setDeliveryCost(3000);
      directReceivePositionRef.current!.style.display = "none";
    } else {
      setDeliveryCost(0);
      directReceivePositionRef.current!.style.display = "block";
    }
  };

  return (
    <Box component={"form"} onSubmit={handleSubmit(handleOrdered)}>
      <Box sx={MStyles.container}>
        <MOrderSheetProducts orderSheet={orderSheet} totalCost={totalCost} />
        <Box>
          <Table sx={MStyles.deliveryBox}>
            <TableBody>
              {/* 주문자 정보 ******************************************** */}
              <TableRow sx={MStyles.deliveryHeader}>
                <TableCell colSpan={2}>주문자 정보</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={MStyles.leftCellSize}>주문하신 분</TableCell>
                <TableCell>
                  <Box>{loginUser && loginUser.username}</Box>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={MStyles.leftCellSize}>이메일</TableCell>
                <TableCell>
                  <Box>{loginUser && loginUser.userid}</Box>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>연락처</TableCell>
                <TableCell sx={MStyles.phoneBox}>
                  <Box>{(loginUser && loginUser.phone) || "등록된 번호가 없습니다"}</Box>
                </TableCell>
              </TableRow>
              {/* 배송 정보 ******************************************** */}
              <TableRow sx={MStyles.deliveryHeader}>
                <TableCell colSpan={2}>배송 정보</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>배송지 선택</TableCell>
                <TableCell>
                  <Box sx={MStyles.orderSheetDeliveryInfoLayout}>
                    <RadioGroup row>
                      <FormControlLabel
                        value={"prev"}
                        label={
                          <Box component={"span"} sx={MStyles.font14}>
                            기본배송지
                          </Box>
                        }
                        control={<Radio size="small" />}
                      />
                      <FormControlLabel
                        value={"new"}
                        label={
                          <Box component={"span"} sx={MStyles.font14}>
                            신규배송지
                          </Box>
                        }
                        control={<Radio size="small" />}
                      />
                    </RadioGroup>
                    <Button
                      variant="outlined"
                      sx={MStyles.orderBtn}
                      size="small"
                      onClick={e => {
                        setDOpen(true);
                      }}>
                      배송지목록
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>
                  <FormControlLabel
                    control={<Checkbox />}
                    label={"주문 고객 정보와 동일"}
                    onClick={() => {
                      // sameReceiver ? setSameReceiver(false) : setSameReceiver(true);
                      copyReceiverInfo();
                    }}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>받는 분 성함</TableCell>
                <TableCell>
                  {/* {sameReceiver ? (
                    <TextField id="recvUser" {...register("receiver")} value={(user && user.username) || loginUser.username} />
                  ) : (
                    <TextField id="recvUser" {...register("receiver")} required />
                  )} */}
                  <TextField id="recvUser" required {...register("receiver")} value={(copyReceiver && copyReceiver.username) || undefined} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>연락처</TableCell>
                <TableCell sx={MStyles.phoneBox}>
                  <TextField
                    id="recvNumber"
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
                    value={(deliveryFromList && deliveryFromList.phone) || phone}
                  />
                  {/* <IMaskInput mask="#00-0000-0000" definitions={{"#": /[0-9]/}} /> */}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>이메일</TableCell>
                <TableCell sx={MStyles.flex}>
                  <TextField
                    id="recvEmail"
                    inputMode="email"
                    {...register("receiverEmail")}
                    value={(copyReceiver && copyReceiver.userid) || undefined}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>배송지 이름</TableCell>
                <TableCell>
                  <TextField
                    id="addressNickname"
                    {...register("addressNickname")}
                    value={(deliveryFromList && deliveryFromList.alias) || undefined}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>우편번호</TableCell>
                <TableCell sx={MStyles.postCodeBox}>
                  <TextField
                    id="zonecode"
                    sx={{width: "100px", marginRight: "5px"}}
                    InputProps={{
                      readOnly: true,
                    }}
                    value={deliveryFromList && deliveryFromList ? deliveryFromList.postcode : postcode ? postcode : "" || undefined}
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
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell rowSpan={3}>주소</TableCell>
                <TableCell>
                  <Box sx={{marginLeft: "4px", span: {fontSize: 12}}}>
                    <FormControlLabel control={<Checkbox {...register("addAddress")} />} label="배송지 목록에 추가" />
                    <FormControlLabel control={<Checkbox {...register("selectAddress")} />} label="기본 배송지로 선택" />
                  </Box>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <TextField
                    id="roadAddress"
                    placeholder="주소"
                    sx={{width: "250px", marginRight: "5px"}}
                    {...register("address1")}
                    InputProps={{
                      readOnly: true,
                    }}
                    value={deliveryFromList && deliveryFromList ? deliveryFromList.address1 : address ? address : "" || ""}
                    // value={deliveryFromList ? deliveryFromList.address1 : address1}
                    required
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <TextField
                    id="roadAddressDetails"
                    placeholder="상세주소"
                    sx={{width: "150px", marginRight: "5px"}}
                    {...register("address2")}
                    value={(deliveryFromList && deliveryFromList.address2) || undefined}
                    required
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>배송 메모</TableCell>
                <TableCell>
                  <TextField id="memo" placeholder="" {...register("description")} />
                </TableCell>
              </TableRow>
              {/* 결제 정보 ******************************************** */}
              <TableRow sx={MStyles.deliveryHeader}>
                <TableCell colSpan={2}>결제 정보</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>수령 방식</TableCell>
                <TableCell>
                  <RadioGroup row defaultValue={"post"}>
                    <FormControlLabel
                      value="post"
                      label={
                        <Box
                          component={"span"}
                          sx={MStyles.font14}
                          onClick={() => {
                            isPost(3000);
                          }}>
                          택배
                        </Box>
                      }
                      control={
                        <Radio
                          size="small"
                          onClick={() => {
                            isPost(3000);
                          }}
                        />
                      }
                    />
                    <FormControlLabel
                      value={"direct"}
                      label={
                        <Box
                          component={"span"}
                          sx={MStyles.font14}
                          onClick={() => {
                            isPost(0);
                          }}>
                          직접수령
                        </Box>
                      }
                      control={
                        <Radio
                          size="small"
                          onClick={() => {
                            isPost(0);
                          }}
                        />
                      }
                    />
                  </RadioGroup>
                  <Box ref={directReceivePositionRef}>서울시 백석동1길 11 2층 (빨간 지붕)</Box>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>상품 금액</TableCell>
                <TableCell>{numberFormat(totalCost)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>배송비</TableCell>
                <TableCell>{numberFormat(deliveryCost)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>결제 금액</TableCell>
                <TableCell sx={MStyles.font20}>{numberFormat(totalCost + deliveryCost)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>결제 방법</TableCell>
                <TableCell sx={MStyles.paymentMethod}>
                  <Controller
                    rules={{required: true}}
                    control={control}
                    name="type"
                    render={({field}) => (
                      <RadioGroup row {...field}>
                        <FormControlLabel
                          value={"pay"}
                          label={
                            <Box component={"span"} sx={MStyles.font14}>
                              페이공제
                            </Box>
                          }
                          control={<Radio size="small" />}
                          onClick={e => {
                            paymentRef.current!.style.display = "block";
                            accountRef.current!.style.display = "none";
                          }}
                        />

                        <Box className="row" ref={paymentRef}>
                          <Box className="header">페이공제</Box>
                          <Box sx={{input: {border: "0 !important"}}}>
                            <Box>
                              간사 이름(장부 이름) <TextField {...register("payname")} />
                            </Box>
                            <Box>
                              간사 번호(장부 번호) <TextField {...register("paynumber")} />
                            </Box>
                          </Box>
                        </Box>
                        <FormControlLabel
                          value={"account"}
                          label={
                            <Box component={"span"} sx={MStyles.font14}>
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

                  <Box ref={accountRef}>
                    <Box>계좌 입금</Box>
                    <Box>결제하기 버튼을 누른 후 카카오뱅크 3333- ... (강다은)으로 입금해주시면 확인 후 상품을 보내드립니다.</Box>
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Box sx={MStyles.buyerBtnBox}>
            <Button variant="contained" type="submit">
              주문하기
            </Button>
          </Box>
        </Box>
        {/*  */}
      </Box>
      <RecentDelivery open={dOpen} setOpen={setDOpen} deliveryList={deliveryList} setDeliveryFromList={setDeliveryFromList} />
      <PostCode open={open} setOpen={setOpen} handleData={handleData} />
    </Box>
  );
}
