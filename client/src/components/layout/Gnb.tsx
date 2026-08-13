import {useNavigate, Outlet, Link, NavLink} from "react-router-dom";
import {useRecoilState} from "recoil";
import {isMobile} from "react-device-detect";

import Box from "@mui/material/Box";
import {TextField} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";

import {useCategoryListQuery} from "@recoils/category/query";
import {isLoggedIn, userState} from "@recoils/user/state";
import Loading from "./Loading";
import Error from "./Error";
import {postLogout} from "@recoils/login/axios";
import {kraft} from "theme/kraft";

export default function Gnb() {
  const {isLoading, isError, data, error} = useCategoryListQuery();
  const list: {id: string | number; title: string; type: string; action: string}[] = (data ?? []).map((c: any) => ({
    id: c.id,
    title: c.title,
    type: c.type,
    action: "/category/" + c.id,
  }));
  const [loginUser, setLoginUser] = useRecoilState(userState);
  const loggedIn = isLoggedIn(loginUser);
  const navigate = useNavigate();

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }

  const onLogout = async () => {
    await postLogout();
    setLoginUser(null);
    alert("로그아웃 되었습니다");
    isMobile ? navigate("/m") : navigate("/");
  };

  return (
    <>
      <Box
        component="header"
        sx={{
          width: "100%",
          minWidth: 1024,
          fontFamily: kraft.sans,
          a: {color: kraft.ink, textDecoration: "none"},
        }}>
        <Box
          sx={{
            width: 1024,
            margin: "0 auto",
            padding: "20px 0 12px",
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}>
          <Box sx={{display: "flex", alignItems: "center", gap: 1.5}}>
            <Box
              component={Link}
              to="/"
              aria-label="E-SHOP 홈"
              sx={{
                backgroundColor: kraft.ink,
                color: kraft.sticker,
                "&&": {color: kraft.sticker},
                fontFamily: kraft.display,
                fontWeight: 700,
                fontSize: 28,
                letterSpacing: "0.04em",
                lineHeight: 1,
                padding: "6px 12px 4px",
              }}>
              E-SHOP
            </Box>
            <Box
              aria-hidden="true"
              sx={{
                width: 56,
                height: 56,
                border: `3px solid ${kraft.stamp}`,
                color: kraft.stamp,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                textAlign: "center",
                fontFamily: kraft.mono,
                fontSize: 9,
                fontWeight: 600,
                lineHeight: 1.15,
                transform: "rotate(-12deg)",
              }}>
              LOT
              <br />
              E
            </Box>
          </Box>
          <Box
            component="nav"
            aria-label="카테고리"
            sx={{display: "flex", gap: 1, flex: 1, minWidth: 200}}>
            {list.map(({id, action, title}) => (
              <Box
                key={id}
                component={Link}
                to={action}
                sx={{
                  backgroundColor: kraft.sticker,
                  padding: "8px 14px 6px",
                  fontWeight: 700,
                  boxShadow: "2px 3px 0 rgba(26, 18, 11, 0.35)",
                  clipPath: "polygon(4px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)",
                  "&:hover": {fontWeight: 800},
                }}>
                {title}
              </Box>
            ))}
          </Box>
          <Box sx={{display: "flex", alignItems: "center", gap: 1, marginLeft: "auto"}}>
            {loggedIn ? (
              <Box component={Link} to="/order/list" aria-label="주문 목록" sx={{display: "flex", color: kraft.ink}}>
                <PersonIcon sx={{fontSize: 28}} />
              </Box>
            ) : (
              <Box
                component={NavLink}
                to="/login"
                sx={{
                  backgroundColor: kraft.sticker,
                  border: `1px solid ${kraft.ink}`,
                  padding: "6px 10px",
                  fontWeight: 700,
                  fontSize: 14,
                }}>
                로그인
              </Box>
            )}
            <Box component={Link} to="/cart/list" aria-label="장바구니" sx={{display: "flex", color: kraft.ink}}>
              <ShoppingCartIcon sx={{fontSize: 28}} />
            </Box>
            {loggedIn && (
              <Box
                component="button"
                type="button"
                onClick={onLogout}
                aria-label="로그아웃"
                sx={{
                  display: "flex",
                  background: "none",
                  border: 0,
                  padding: 0,
                  cursor: "pointer",
                  color: kraft.ink,
                }}>
                <LogoutIcon sx={{fontSize: 28}} />
              </Box>
            )}
            <TextField
              size="small"
              placeholder="로트·원두 검색"
              inputProps={{"aria-label": "검색"}}
              sx={{
                width: 160,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: kraft.sticker,
                },
              }}
              InputProps={{
                endAdornment: <SearchIcon sx={{cursor: "pointer", color: kraft.ink}} />,
              }}
            />
          </Box>
        </Box>
      </Box>
      <Outlet />
    </>
  );
}
