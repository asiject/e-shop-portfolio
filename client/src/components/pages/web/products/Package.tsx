import React, {useEffect, useRef, useState} from "react";
import {Box, Button, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {styles} from "../../layout/styles";
import Location from "./div/Location";
export default function Package({packageMethod, setPackageMethod}: any) {
  const [open, setOpen] = useState(false);
  const delivery = useRef<HTMLElement>();
  const location = useRef<HTMLElement>();
  const handleChange = (e: any) => {
    setPackageMethod(e.target.value);
    selectMethod(e.target.value);
  };
  useEffect(() => {
    if (packageMethod) {
      selectMethod(packageMethod);
    } else {
      delivery.current!.style.display = "none";
      location.current!.style.display = "none";
    }
  }, [packageMethod]);
  const selectMethod = (method: string) => {
    method == "택배"
      ? ((delivery.current!.style.display = "block"), (location.current!.style.display = "none"))
      : ((delivery.current!.style.display = "none"), (location.current!.style.display = "block"));
  };
  return (
    <Box>
      <FormControl sx={styles.package} size="small">
        <InputLabel id="demo-select-small-label">수령방법</InputLabel>
        <Select
          labelId="demo-select-small-label"
          id="demo-select-small"
          value={packageMethod}
          label="수령방법"
          MenuProps={{disableScrollLock: true}}
          onChange={handleChange}>
          <MenuItem value={"택배"}>택배</MenuItem>
          <MenuItem value={"방문수령"}>방문수령</MenuItem>
        </Select>
      </FormControl>
      <Box sx={styles.packageInfo}>
        <Box ref={delivery} sx={{display: "none"}}>
          택배비 3,000원
        </Box>
        <Box ref={location}>
          <Button onClick={() => setOpen(true)} variant={"text"} sx={{display: "none"}}>
            <LocationOnIcon />
            <Box component="span">위치보기</Box>
          </Button>
        </Box>
      </Box>
      <Location open={open} setOpen={setOpen} />
    </Box>
  );
}
