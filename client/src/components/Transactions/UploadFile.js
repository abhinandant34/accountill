/* eslint-disable */
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";

import { useDispatch, useSelector } from "react-redux";
import {
  createTransaction,
  updateTransaction,
  uploadTransactionsFile,
} from "../../actions/transactionActions";
import { useSnackbar } from "react-simple-snackbar";
import moment from "moment";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    backgroundColor: "#1976D2",
    marginLeft: 0,
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: "white",
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const UploadFile = ({ setOpen, open, currentId, setCurrentId }) => {
  let currentDate = moment().format("YYYY-MM-DD");
  const location = useLocation();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const dispatch = useDispatch();
  const transaction = useSelector((state) =>
    currentId
      ? state.transactions.transactions.find((c) => c._id === currentId)
      : null
  );
  // eslint-disable-next-line
  const [openSnackbar, closeSnackbar] = useSnackbar();
  const [uploadFile,setUploadFile]=useState([]);

  useEffect(() => {
    if (transaction) {
      setTransactionData(transaction);
    }
  }, [transaction]);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("profile")));
    // setTransactionData({...transactionData, userId: user?.result?._id})
  }, [location]);

//   useEffect(() => {
//     var checkId = user?.result?._id;
//     if (checkId !== undefined) {
//       setTransactionData({ ...transactionData, userId: [checkId] });
//     } else {
//       setTransactionData({
//         ...transactionData,
//         userId: [user?.result?.googleId],
//       });
//     }
//   }, [location]);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    setUploadFile({ ...uploadFile, file: uploadedFile });
  };

  const handleUpload = (e) => {
    e.preventDefault();
    dispatch(uploadTransactionsFile(uploadFile, openSnackbar));
    clear();
    handleClose();
  };

  const clear = () => {
    // setCurrentId(null)
  };

  const handleClose = () => {
    setOpen(false);
  };

  const inputStyle = {
    display: "block",
    padding: "1.4rem 0.75rem",
    width: "100%",
    fontSize: "0.8rem",
    lineHeight: 1.25,
    color: "#55595c",
    backgroundColor: "#fff",
    backgroundImage: "none",
    backgroundClip: "padding-box",
    borderTop: "0",
    borderRight: "0",
    borderBottom: "1px solid #eee",
    borderLeft: "0",
    borderRadius: "3px",
    transition: "all 0.25s cubic-bezier(0.4, 0, 1, 1)",
  };

  return (
    <div>
      <form>
        <Dialog
          onClose={(e, reason) => {
            if (reason !== "backdropClick") {
              handleClose();
            }
          }}
          aria-labelledby="customized-dialog-title"
          open={open}
          fullWidth
        >
          <DialogTitle
            id="customized-dialog-title"
            onClose={handleClose}
            style={{ paddingLeft: "20px", color: "white" }}
          >
            {currentId ? "Edit Transaction" : "Upload File"}
          </DialogTitle>
          <DialogContent dividers>
            <div className="customInputs">
              <input
                placeholder="Description"
                style={inputStyle}
                name="file"
                type="file"
                onChange={handleFileUpload}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleUpload}
              variant="contained"
              style={{ marginRight: "25px" }}
            >
              Upload File
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
};

export default UploadFile;
