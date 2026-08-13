import {useNavigate, Outlet, Link, NavLink} from "react-router-dom";
import {useRecoilState} from "recoil";
import {isMobile} from "react-device-detect";

import Box from "@mui/material/Box";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";

import {useCategoryListQuery} from "@recoils/category/query";
import {isLoggedIn, userState} from "@recoils/user/state";
import Loading from "./Loading";
import Error from "./Error";
import {postLogout} from "@recoils/login/axios";
import {kraft} from "theme/kraft";

export default function MGnb() {
  const {isLoading, isError, data, error} = useCategoryListQuery();
  const list = (data ?? []).map((c: any) => ({
    id: c.id,
    title: c.title,
    type: c.type,
    action: "/m/category/" + c.id,
  }));
  const [user, setUser] = useRecoilState(userState);
  const loggedIn = isLoggedIn(user);
  const navigate = useNavigate();

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }

  const onLogout = async () => {
    await postLogout();
    setUser(null);
    alert("로그아웃 되었습니다");
    isMobile ? navigate("/m") : navigate("/");
  };

  return (
    <>
      <Box
        component="header"
        sx={{
          width: "100%",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backgroundColor: kraft.paper,
          fontFamily: kraft.sans,
          a: {color: kraft.ink, textDecoration: "none"},
        }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 12px",
            gap: 1,
          }}>
          <Box sx={{display: "flex", color: kraft.ink}}>
            <MenuIcon sx={{fontSize: 26, mr: 0.5}} />
            <SearchIcon sx={{fontSize: 26}} />
          </Box>
          <Box
            component={Link}
            to="/m/"
            aria-label="1958SHOP 홈"
            sx={{
              backgroundColor: kraft.ink,
              color: kraft.sticker,
              "&&": {color: kraft.sticker},
              fontFamily: kraft.display,
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: "0.04em",
              padding: "4px 8px 3px",
              lineHeight: 1,
            }}>
            1958SHOP
          </Box>
          <Box sx={{display: "flex", alignItems: "center", gap: 0.5, color: kraft.ink}}>
            {loggedIn ? (
              <>
                <Box component={Link} to="/m/order/list" aria-label="주문 목록" sx={{display: "flex"}}>
                  <PersonIcon sx={{fontSize: 26}} />
                </Box>
                <Box component={Link} to="/m/cart/list" aria-label="장바구니" sx={{display: "flex"}}>
                  <ShoppingCartIcon sx={{fontSize: 26}} />
                </Box>
                <Box
                  component="button"
                  type="button"
                  onClick={onLogout}
                  aria-label="로그아웃"
                  sx={{display: "flex", background: "none", border: 0, padding: 0, cursor: "pointer", color: kraft.ink}}>
                  <LogoutIcon sx={{fontSize: 26}} />
                </Box>
              </>
            ) : (
              <Box
                component={NavLink}
                to="/login"
                sx={{
                  backgroundColor: kraft.sticker,
                  border: `1px solid ${kraft.ink}`,
                  padding: "4px 8px",
                  fontWeight: 700,
                  fontSize: 13,
                }}>
                로그인
              </Box>
            )}
          </Box>
        </Box>
        <Box
          component="nav"
          aria-label="카테고리"
          sx={{
            display: "flex",
            overflowX: "auto",
            gap: 1,
            padding: "0 12px 10px",
          }}>
          {list.map(({id, action, title}: {id: string; action: string; title: string}) => (
            <Box
              key={id}
              component={Link}
              to={action}
              sx={{
                flex: "0 0 auto",
                backgroundColor: kraft.sticker,
                padding: "6px 12px",
                fontWeight: 700,
                fontSize: 13,
                boxShadow: "2px 3px 0 rgba(26, 18, 11, 0.35)",
              }}>
              {title}
            </Box>
          ))}
        </Box>
      </Box>
      <Outlet />
    </>
  );
}
