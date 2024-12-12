import { Button } from "@mui/material";

import React from "react";

const CButton = (props) => {
  return (
    <Button
      style={{ marginTop: "1%" }}
      variant="contained"
      onClick={props.onClick}
    >
      {props?.children}
    </Button>
  );
};

export default CButton;
