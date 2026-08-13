export default function statusCheck(status: string) {
  let statement = "";
  switch (status) {
    case "WAIT":
      statement = "입금대기";
      break;
    case "PAYMENT":
      statement = "결제완료";
      break;
    case "PREPARE":
      statement = "상품준비중";
      break;
    case "COMPLETE":
      statement = "발송완료";
      break;
    case "REQ_CANCEL":
      statement = "취소요청";
      break;
    case "CANCEL":
      statement = "취소완료";
      break;
    case "REQ_RETURN":
      statement = "반송요청";
      break;
    case "RCV_RETURN":
      statement = "반송접수";
      break;
    case "RETURN":
      statement = "반송완료";
      break;
    case "REQ_CHANGE":
      statement = "교환요청";
      break;
    case "RCV_CHANGE":
      statement = "교환접수";
      break;
    case "CHANGE":
      statement = "교환완료";
      break;
  }
  return statement;
}
