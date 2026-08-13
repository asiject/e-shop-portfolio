import DesktopStyle from "./styles.desktop";
import MobileStyle from "./styles.mobile";
import CommonStyle from "./styles.common";
export const Styles = () => {
  return {
    ...DesktopStyle,
    ...CommonStyle,
  };
};
export const MStyles = {
  ...MobileStyle,
  ...CommonStyle,
};
