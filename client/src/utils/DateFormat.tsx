export default function dateFormat(date: any) {
  const time = new Date(date);
  return `${time.getFullYear()}.${time.getMonth() > 9 ? time.getMonth() + 1 : "0" + (time.getMonth() + 1)}.${
    time.getDate() < 10 ? "0" + time.getDate() : time.getDate()
  }`;
}
