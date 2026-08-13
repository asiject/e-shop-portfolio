import AdminGnb from "@layout/AdminGnb";
import {Box} from "@mui/material";

export default function PolicyList() {
  return (
    <AdminGnb>
      <MainPane />
    </AdminGnb>
  );
}
function MainPane() {
  return <Box sx={{p: 3}}>PolicyList</Box>;
}
