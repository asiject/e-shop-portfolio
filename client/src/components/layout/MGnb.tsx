import {useEffect, useState} from "react";
import {useNavigate, Outlet, Link, NavLink} from "react-router-dom";
import {useRecoilState} from "recoil";
import {isMobile} from "react-device-detect";

import Box from "@mui/material/Box";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";

import {getCategoryListQuery} from "@recoils/category/query";
import {userState} from "@recoils/user/state";
import Loading from "./Loading";
import Error from "./Error";
import {MStyles} from "@styles";

export default function MGnb() {
  const {isLoading, isError, data, error} = getCategoryListQuery();
  const [list, setList] = useState([]);
  const [user, setUser] = useRecoilState(userState);
  const navigate = useNavigate();
  useEffect(() => {
    if (data) {
      setList(
        data?.map((c: any) => ({
          id: c.id,
          title: c.title,
          type: c.type,
          action: "/m/category/" + c.id,
        })),
      );
    }
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }

  const onLogout = () => {
    alert("로그아웃 되었습니다");
    setUser(null);
    isMobile ? navigate("/m") : navigate("/");
  };

  return (
    <>
      <Box sx={MStyles.mgnb}>
        <Box sx={MStyles.header}>
          <Box sx={MStyles.headerLeftBox}>
            <Box sx={MStyles.icon}>
              <MenuIcon />
            </Box>
            <Box sx={MStyles.icon}>
              <SearchIcon />
            </Box>
          </Box>
          <Box sx={MStyles.logo}>
            <Link to="/m/">
              <Box component={"img"} src="/public/img/logo.jpg" />
            </Link>
          </Box>
          {user ? (
            <Box sx={MStyles.headerRightBox}>
              <Box sx={MStyles.iconbox}>
                <Box>
                  <Link to="/m/order/list">
                    <Box sx={MStyles.icon}>
                      <PersonIcon />
                    </Box>
                    {/* 마이정보 */}
                  </Link>
                </Box>
              </Box>
              <Box sx={MStyles.iconbox}>
                <Box>
                  <Link to="/m/cart/list">
                    <Box sx={MStyles.icon}>
                      <ShoppingCartIcon />
                    </Box>
                    {/* 장바구니 */}
                  </Link>
                </Box>
              </Box>
              <Box sx={MStyles.iconbox}>
                <Box>
                  <Box>
                    <Box sx={MStyles.icon} onClick={onLogout}>
                      <LogoutIcon />
                    </Box>
                    {/* 로그아웃 버튼 */}
                  </Box>
                </Box>
              </Box>
            </Box>
          ) : (
            // <Box sx={MStyles.iconbox}>
            //   <Box>
            //     <Link to="/m/login">
            //       <Box sx={MStyles.icon}>
            //         <GoogleIcon />
            //       </Box>
            //     </Link>
            //   </Box>
            // </Box>

            <Box sx={MStyles.headerRightBox}>
              <Box sx={MStyles.iconbox}>
                {user ? (
                  <Box>
                    <Box sx={MStyles.icon}>
                      <PersonIcon />
                    </Box>
                  </Box>
                ) : (
                  <NavLink to="/login">로그인</NavLink>
                )}
              </Box>
            </Box>
          )}
        </Box>
        <Box sx={MStyles.menubar}>
          <Box component={"ul"} sx={MStyles.menulist}>
            {list.length > 0 &&
              list.map(({id, action, title}: {id: string; action: string; title: string}) => <Menu key={id} action={action} title={title} />)}
          </Box>
        </Box>
      </Box>
      <Outlet />
    </>
  );
}
function Menu({action, title}: {action: string; title: string}) {
  return (
    <Box component={"li"}>
      <Link to={action}>{title}</Link>
    </Box>
  );
}
