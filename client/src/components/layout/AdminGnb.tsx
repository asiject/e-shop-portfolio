import * as React from "react"
import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"
import {FormControl, IconButton, MenuItem, Select, SelectChangeEvent, ThemeProvider, createTheme, useMediaQuery} from "@mui/material"
import {useLocation, useNavigate} from "react-router"
import {useAdminMenuListQuery} from "@recoils/admin/menu/query"
import Loading from "./Loading"
import Error from "./Error"
import {useRecoilState, useSetRecoilState} from "recoil"
import {localeState} from "@recoils/admin/menu/state"
import {userState} from "@recoils/user/state"
import {postLogout} from "@recoils/login/axios"
import {getShopHomePath} from "@utils/safeBack"
import {FormattedMessage, useIntl} from "react-intl"
import MenuIcon from "@mui/icons-material/Menu"
import {wb} from "theme/adminWorkbench"
import {adminNavTree, isMainNavCurrent, isSubnavCurrent, SubnavCountKey} from "./admin/adminSubnav"
import {useAdminDashboardStatsQuery} from "@recoils/admin/order/query"

const workbenchTheme = createTheme({
  palette: {
    primary: {main: wb.action, contrastText: "#fff"},
    text: {primary: wb.ink, secondary: wb.mute},
    background: {default: wb.bg, paper: wb.paper},
  },
  typography: {fontFamily: '"Noto Sans KR", sans-serif'},
  shape: {borderRadius: 2},
  components: {
    MuiButton: {styleOverrides: {root: {textTransform: "none"}}},
  },
})

const standard = "(max-width: 1024px)"

type AdminMenu = {id: number; title: string; url: string; useyn: string}

type AdminGnbProps = {
  RightButtons?: React.ReactNode
  children: React.ReactNode
}

export default function AdminGnb({RightButtons, children}: AdminGnbProps) {
  const [locale, setLocale] = useRecoilState(localeState)
  const setLoginUser = useSetRecoilState(userState)
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useMediaQuery(standard)
  const [open, setOpen] = React.useState(false)
  const {formatMessage} = useIntl()
  const {isLoading, isError, data} = useAdminMenuListQuery()
  const statsQuery = useAdminDashboardStatsQuery()

  if (isLoading) return <Loading />
  if (isError) return <Error />

  const handleLocale = (e: SelectChangeEvent) => {
    setLocale(e.target.value)
  }

  const handleGoShop = () => {
    navigate(getShopHomePath())
  }

  const handleLogout = async () => {
    await postLogout()
    setLoginUser(null)
    alert("로그아웃 되었습니다")
    navigate(getShopHomePath())
  }

  const menus = ((data || []) as AdminMenu[]).filter(item => item.useyn === "Y")
  const counts = statsQuery.stats

  const handleNav = (to: string) => {
    navigate(to)
    setOpen(false)
  }

  const rail = (
    <Box sx={{display: "flex", flexDirection: "column", height: "100%", bgcolor: wb.rail, color: wb.railText}}>
      <Box component="nav" aria-label="관리 분류 메뉴" sx={{p: 1.5, overflow: "auto", flex: 1}}>
        {adminNavTree.map(major => (
          <Box key={major.id} sx={{mb: 2}}>
            <Box sx={{px: 1, mb: 0.75, fontSize: 11, fontWeight: 650, letterSpacing: "0.06em", color: wb.railMute}}>{major.label}</Box>
            {major.children.map(mid => {
              const sectionActive = mid.children.some(leaf => isSubnavCurrent(leaf.to, location.pathname, location.search))
              return (
                <Box key={mid.id} sx={{mb: 0.25}}>
                  <RailButton label={mid.label} current={false} sectionActive={sectionActive} hasChildren isOpen onClick={() => handleNav(mid.to)} />
                  <Box role="group" aria-label={`${mid.label} 소분류`} sx={{pl: 2, mt: 0.25}}>
                    {mid.children.map(leaf => {
                      const leafCurrent = isSubnavCurrent(leaf.to, location.pathname, location.search)
                      const count = leaf.countKey ? counts[leaf.countKey as SubnavCountKey] : undefined
                      const hot =
                        typeof count === "number" && count > 0 && leaf.countKey !== "complete" && leaf.countKey !== "shipment"
                      return (
                        <RailButton
                          key={leaf.id}
                          label={leaf.label}
                          current={leafCurrent}
                          count={count}
                          hot={hot}
                          nested
                          onClick={() => handleNav(leaf.to)}
                        />
                      )
                    })}
                  </Box>
                </Box>
              )
            })}
          </Box>
        ))}
      </Box>
      <Box sx={{p: 1.5, borderTop: "1px solid #292524"}}>
        <FormControl fullWidth size="small">
          <Select
            displayEmpty
            onChange={handleLocale}
            value={locale}
            sx={{
              color: wb.railText,
              bgcolor: "#292524",
              "& .MuiOutlinedInput-notchedOutline": {border: 0},
              "& .MuiSvgIcon-root": {color: wb.railMute},
            }}>
            <MenuItem disabled>{formatMessage({id: "language"})}</MenuItem>
            <MenuItem value="ko">{formatMessage({id: "locale.ko"})}</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  )

  return (
    <ThemeProvider theme={workbenchTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "grid",
          gridTemplateRows: `${wb.top}px 1fr`,
          bgcolor: wb.bg,
          color: wb.ink,
          fontFamily: '"Noto Sans KR", sans-serif',
        }}>
        <Box
          component="header"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            px: 2,
            bgcolor: wb.rail,
            color: wb.railText,
          }}>
          {isMobile && (
            <IconButton aria-label="분류 메뉴 열기" onClick={() => setOpen(v => !v)} sx={{color: wb.railText}}>
              <MenuIcon />
            </IconButton>
          )}
          <Box sx={{fontWeight: 700, letterSpacing: "-0.03em", mr: 2, whiteSpace: "nowrap"}}>E샵 작업대</Box>
          <Box component="nav" aria-label="관리 메뉴" sx={{display: "flex", alignItems: "center", gap: 0.5, overflow: "auto", flex: 1}}>
            {menus.map(item => {
              const current = isMainNavCurrent(item.url, location.pathname)
              return (
                <Box
                  key={item.id}
                  component="button"
                  type="button"
                  aria-current={current ? "page" : undefined}
                  onClick={() => navigate(item.url)}
                  sx={{
                    height: 28,
                    px: 1.25,
                    border: 0,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    font: "inherit",
                    fontSize: 13,
                    color: current ? "#fff" : wb.railMute,
                    bgcolor: current ? "#292524" : "transparent",
                    "&:hover": {color: "#fff"},
                  }}>
                  <FormattedMessage id={item.title} defaultMessage={item.title} />
                </Box>
              )
            })}
          </Box>
          <Box sx={{ml: "auto", display: "flex", alignItems: "center", gap: 1.5, pl: 1, color: wb.railMute, fontSize: 13}}>
            {RightButtons && (
              <Box sx={{display: "flex", alignItems: "center", color: wb.railText, "& .MuiIconButton-root": {color: wb.railText}}}>{RightButtons}</Box>
            )}
            <Box
              component="button"
              type="button"
              onClick={handleGoShop}
              sx={{border: 0, bgcolor: "transparent", color: wb.railText, cursor: "pointer", font: "inherit"}}>
              {formatMessage({id: "shop"})}
            </Box>
            <Box component="button" type="button" onClick={handleLogout} sx={{border: 0, bgcolor: "transparent", color: wb.railText, cursor: "pointer", font: "inherit"}}>
              {formatMessage({id: "logout"})}
            </Box>
          </Box>
        </Box>
        <Box sx={{display: "grid", gridTemplateColumns: isMobile ? "1fr" : `${wb.railWidth}px 1fr`, minHeight: 0}}>
          {isMobile ? (
            <Drawer
              variant="temporary"
              open={open}
              onClose={() => setOpen(false)}
              PaperProps={{sx: {width: wb.railWidth, bgcolor: wb.rail, color: wb.railText}}}>
              {rail}
            </Drawer>
          ) : (
            rail
          )}
          <Box component="main" sx={{minWidth: 0, bgcolor: wb.bg, p: 2}}>
            {children}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

type RailButtonProps = {
  label: string
  current: boolean
  sectionActive?: boolean
  count?: number
  hot?: boolean
  nested?: boolean
  hasChildren?: boolean
  isOpen?: boolean
  onClick: () => void
}

function RailButton({label, current, sectionActive, count, hot, nested, hasChildren, isOpen, onClick}: RailButtonProps) {
  return (
    <Box
      component="button"
      type="button"
      aria-current={current ? "page" : undefined}
      aria-expanded={hasChildren ? isOpen : undefined}
      onClick={onClick}
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 1,
        py: nested ? 1 : 1.25,
        px: nested ? 1.25 : 1.25,
        mb: 0.25,
        border: 0,
        textAlign: "left",
        cursor: "pointer",
        font: "inherit",
        fontSize: nested ? 13 : 14,
        color: current || sectionActive ? "#fff" : nested ? wb.railMute : wb.railText,
        bgcolor: current ? "#44403c" : "transparent",
        "&:hover": {bgcolor: "#292524"},
      }}>
      {hasChildren && (
        <Box
          component="span"
          aria-hidden="true"
          sx={{
            width: 0,
            height: 0,
            borderLeft: "5px solid currentColor",
            borderTop: "4px solid transparent",
            borderBottom: "4px solid transparent",
            transform: isOpen ? "rotate(90deg)" : "none",
            transformOrigin: "25% 50%",
            flex: "none",
          }}
        />
      )}
      <Box component="span" sx={{flex: 1}}>
        {label}
      </Box>
      {typeof count === "number" && (
        <Box component="span" sx={{fontWeight: 700, fontVariantNumeric: "tabular-nums", color: hot ? "#fdba74" : "inherit"}}>
          {count}
        </Box>
      )}
    </Box>
  )
}
