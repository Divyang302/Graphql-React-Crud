import React, { useEffect } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

function DeletePopup({ deleteTemp, setDeleteTemp, deleteTemplateFun }) {
  //   const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setDeleteTemp(false);
  };
  return (
    <div>
      <Dialog
        open={deleteTemp}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {/* <DialogTitle id="alert-dialog-title">
       {"Are You Sure"}
      </DialogTitle> */}
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the Template? This change cannot be
            reverted!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button
            onClick={() => {
              setDeleteTemp(false);
              deleteTemplateFun();
            }}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DeletePopup;
