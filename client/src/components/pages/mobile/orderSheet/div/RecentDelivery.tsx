import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {Box, Button, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import {MStyles} from "@styles";

export default function RecentDelivery({open, setOpen, deliveryList, setDeliveryFromList}: any) {
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={MStyles.recentDeliveryBox}>
        <DialogTitle id="alert-dialog-title" sx={{display: "flex"}}>
          <Box>배송지 목록</Box>
          <Box sx={{marginLeft: "auto", cursor: "pointer"}} onClick={() => handleClose()}>
            X
          </Box>
        </DialogTitle>
        <DialogContent sx={MStyles.recentDeliveryBox}>
          <Table>
            <TableHead sx={MStyles.orderTableHeader}>
              <TableRow>
                <TableCell>배송지 이름</TableCell>
                <TableCell>주소</TableCell>
                <TableCell>연락처</TableCell>
                <TableCell>선택</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deliveryList &&
                deliveryList?.map((delivery: any, index: number) => {
                  return <DestinationList key={index} delivery={delivery} setDeliveryFromList={setDeliveryFromList} setOpen={setOpen} />;
                })}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

function DestinationList({delivery, setDeliveryFromList, setOpen}: any) {
  const {alias, postcode, address1, address2, phone} = delivery;
  return (
    <TableRow>
      <TableCell>{alias}</TableCell>
      <TableCell>{`(${postcode}) ${address1} ${address2}`}</TableCell>
      <TableCell>{phone}</TableCell>
      <TableCell sx={{textAlign: "center"}}>
        <Button
          variant="outlined"
          onClick={() => {
            setDeliveryFromList({alias, postcode, address1, address2, phone});
            setOpen(false);
          }}>
          선택
        </Button>
      </TableCell>
    </TableRow>
  );
}
