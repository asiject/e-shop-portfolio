import {useEffect, useState} from "react";
import {useNavigate, Outlet, Link, NavLink} from "react-router-dom";
import {useRecoilState, useRecoilValue} from "recoil";
import {isMobile} from "react-device-detect";

import Box from "@mui/material/Box";
import {TextField} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";

import {getCategoryListQuery} from "@recoils/category/query";
import {userState} from "@recoils/user/state";
import {Styles} from "@styles";
import Loading from "./Loading";
import Error from "./Error";
import {postLogout} from "@recoils/login/axios";

export default function Gnb() {
  const {isLoading, isError, data, error} = getCategoryListQuery();
  const [list, setList] = useState([]);
  const [loginUser, setLoginUser] = useRecoilState(userState);
  const styles = Styles();
  const navigate = useNavigate();

  useEffect(() => {
    if (list?.length == 0) {
      setList(
        data?.map((c: any) => ({
          id: c.id,
          title: c.title,
          type: c.type,
          action: "/category/" + c.id,
        })) || [],
      );
    }
  }, [data]);

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
      <Box sx={styles.gnb}>
        <Box sx={styles.srch}>
          <Box sx={styles.logo}>
            <Link to="/">
              <Box component={"img"} src="/public/img/logo.jpg" />
            </Link>
          </Box>
          <Box sx={styles.menubox}>
            <Box component={"ul"} sx={styles.menulist}>
              {list.map(({id, action, title}) => (
                <Menu key={id} action={action} title={title} />
              ))}
            </Box>
          </Box>
          <Box sx={styles.rightbox}>
            <Box sx={styles.topicon}>
              {loginUser && loginUser.userid != 0 ? (
                <Box sx={styles.iconbox}>
                  <Link to="/order/list">
                    <Box sx={styles.icon}>
                      <PersonIcon />
                    </Box>
                  </Link>
                </Box>
              ) : (
                <Box sx={styles.iconbox}>
                  <Box sx={styles.icon}>
                    <NavLink to="/login">로그인</NavLink>
                  </Box>
                </Box>
              )}
              <Box sx={styles.iconbox}>
                <Box>
                  <Link to="/cart/list">
                    <Box sx={styles.icon}>
                      <ShoppingCartIcon />
                    </Box>
                  </Link>
                </Box>
              </Box>
              {loginUser && (
                <Box sx={styles.iconbox}>
                  <Box>
                    <Box sx={styles.icon} onClick={onLogout}>
                      <LogoutIcon />
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
            <Box sx={styles.srchbar}>
              <TextField
                sx={styles.srchInput}
                InputProps={{
                  endAdornment: <SearchIcon sx={{cursor: "pointer", color: "#9ac66d"}} />,
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Outlet />
    </>
  );
}
function Menu({action, title}: {action: string; title: string}) {
  const styles = Styles();
  return (
    <Box component={"li"} sx={styles.menu}>
      <Link to={action}>{title}</Link>
    </Box>
  );
}
