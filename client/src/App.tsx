import {useEffect, useState} from "react";
import {useSetRecoilState} from "recoil";

import {fetchSessionUser, userState} from "@recoils/user/state";
import ShopRoutes from "routes/shop/ShopRoutes";
import Loading from "@layout/Loading";
import AppSnackbar from "@layout/AppSnackbar";

export default function App() {
  return <AppRoutes />;
}

function AppRoutes() {
  const setUser = useSetRecoilState(userState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const user = await fetchSessionUser();
      if (cancelled) return;
      // 게스트면 set하지 않음 — null로 다시 set하면 불필요 리렌더만 발생
      if (user) setUser(user);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [setUser]);

  if (!ready) {
    return <Loading />;
  }

  return (
    <>
      <ShopRoutes />
      <AppSnackbar />
    </>
  );
}
