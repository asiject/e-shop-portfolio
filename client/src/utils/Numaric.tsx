export function numberFormat(value: number, unit = "원") {
  value = isNaN(value) ? 0 : value;
  var regexp = /\B(?=(\d{3})+(?!\d))/g;

  return String(value).replace(regexp, ",") + unit;
  //   return Number(money).toLocaleString("ko-kr");
}
