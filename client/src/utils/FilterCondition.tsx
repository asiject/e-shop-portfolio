export function userFilter({list, keyword}: any) {
  return keyword
    ? list?.filter(({username, phone, sabun}: any) => username?.includes(keyword) || phone?.includes(keyword) || sabun?.includes(keyword))
    : list;
}
