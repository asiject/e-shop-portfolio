import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import {useNavigate} from "react-router";
import {useAdminMenuListQuery} from "@recoils/admin/menu/query";
import Loading from "./Loading";
import Error from "./Error";
import {Divider, FormControl, IconButton, MenuItem, Select, useMediaQuery} from "@mui/material";
import {useRecoilState, useSetRecoilState} from "recoil";
import {localeState} from "@recoils/admin/menu/state";
import {userState} from "@recoils/user/state";
import {postLogout} from "@recoils/login/axios";
import {FormattedMessage, useIntl} from "react-intl";
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 240;
const standard = "(max-width: 1024px)";

export default function AdminGnb({RightButtons, children}: any) {
  const [locale, setLocale] = useRecoilState(localeState);
  const setLoginUser = useSetRecoilState(userState);
  const navigate = useNavigate();
  const isMobile = useMediaQuery(standard);
  const [open, setOpen] = React.useState(false);
  const {formatMessage} = useIntl();
  const {isLoading, isError, data, error} = useAdminMenuListQuery();
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error />;
  }

  const handleLocale = (e: any) => {
    const {
      target: {value},
    } = e;
    setLocale(value);
  };

  const handleLogout = async () => {
    await postLogout();
    setLoginUser(null);
    alert("로그아웃 되었습니다");
    navigate("/admin");
  };

  return (
    <Box sx={{display: "flex"}}>
      <CssBaseline />
      <Header isMobile={isMobile} setOpen={setOpen} RightButtons={RightButtons} />
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        anchor={"left"}
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {width: drawerWidth, boxSizing: "border-box"},
        }}>
        <Toolbar />
        <Box sx={{overflow: "auto"}}>
          <MenuList data={data} />
          <Divider />
          <List>
            <FormControl sx={{width: "100%", padding: "10px 10px 0 10px"}}>
              <Select displayEmpty onChange={handleLocale} value={locale} sx={{borderRadius: "14px"}}>
                <MenuItem disabled>
                  {formatMessage({id: "language"})}
                  {/* 언어 */}
                </MenuItem>
                <MenuItem key="ko" value="ko">
                  {formatMessage({id: "locale.ko"})}
                </MenuItem>
                {/* <MenuItem key="en" value="en">
                  {formatMessage({id: "locale.en"})}
                </MenuItem> */}
              </Select>
            </FormControl>
            <ListItem key={"logout"} disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemText primary={formatMessage({id: "logout"})} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <MainPane>{children}</MainPane>
    </Box>
  );
}
function Header({isMobile, setOpen, RightButtons}: any) {
  return (
    <AppBar position="fixed" sx={{zIndex: theme => theme.zIndex.drawer + 1}}>
      <Toolbar>
        {isMobile && (
          <IconButton
            sx={{color: "white"}}
            edge="start"
            onClick={() => {
              setOpen((open: boolean) => !open);
            }}>
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" noWrap component="div" sx={{flexGrow: 1}}>
          E샵 관리자
        </Typography>
        {RightButtons}
      </Toolbar>
    </AppBar>
  );
}
function MainPane({children}: any) {
  return (
    <Box component="main" sx={{flexGrow: 1}}>
      <Toolbar />
      {children}
    </Box>
  );
}
function MenuList({data}: any) {
  const navigate = useNavigate();
  const onPageMove = (url: string, title: string) => {
    if (url != location?.pathname) {
      navigate(url);
    }
  };

  return data?.map(({id, title, url, useyn}: any) => {
    if (useyn == "Y") {
      return <Menu key={id} id={id} title={<FormattedMessage id={title} defaultMessage={title} />} url={url} onPageMove={onPageMove} />;
    }
  });
}
function Menu({id, title, url, onPageMove}: any) {
  return (
    <>
      <ListItemButton selected={location?.pathname.startsWith(url)} key={id} onClick={() => onPageMove(url, title)}>
        <ListItemText primary={title} />
      </ListItemButton>
    </>
  );
}
