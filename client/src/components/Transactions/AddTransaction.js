/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

import { useDispatch, useSelector } from 'react-redux'
import { createTransaction, updateTransaction } from '../../actions/transactionActions'
import { useSnackbar } from 'react-simple-snackbar'
import moment from "moment";
import {ACCOUNT_NAMES} from "../../actions/constants";
import invoice from "../Invoice/Invoice";
import {toOptions} from "../../utils/utils";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    backgroundColor: '#1976D2',
    marginLeft: 0,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: 'white',
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
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

const AddTransaction = ({ setOpen, open, currentId, setCurrentId }) => {
  let currentDate = moment().format("YYYY-MM-DD");
  const location = useLocation()
  const [transactionData, setTransactionData] = useState({ name: '', amount: '', type: '', date: currentDate, description: '', userId: '' })
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))
  const dispatch = useDispatch()
  const transaction = useSelector((state) => currentId ? state.transactions.transactions.find((c) => c._id === currentId) : null)
  // eslint-disable-next-line
  const [openSnackbar, closeSnackbar] = useSnackbar()

  useEffect(() => {
    if (transaction) {
      setTransactionData(transaction)
    }
  }, [transaction])

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('profile')))
    // setTransactionData({...transactionData, userId: user?.result?._id})
  }, [location])


  useEffect(() => {
    var checkId = user?.result?._id
    if (checkId !== undefined) {
      setTransactionData({ ...transactionData, userId: [checkId] })
    } else {
      setTransactionData({ ...transactionData, userId: [user?.result?.googleId] })
    }

  }, [location])


  const handleSubmitTransaction = (e) => {
    e.preventDefault()
    if (currentId) {
      dispatch(updateTransaction(currentId, transactionData, openSnackbar))
    } else {
      dispatch(createTransaction(transactionData, openSnackbar))
    }

    clear()
    handleClose()
  }

  const clear = () => {
    // setCurrentId(null)
    setTransactionData({ name: '', amount: '', type: '', date: currentDate, description: "", userId: "" })
  }

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
    transition: "all 0.25s cubic-bezier(0.4, 0, 1, 1)"
  }

  return (
    <div>
      <form >
        <Dialog
          onClose={(e, reason) => {
            if (reason !== 'backdropClick') {
              handleClose()
            }
          }}
          aria-labelledby="customized-dialog-title"
          open={open} fullWidth
        >
          <DialogTitle id="customized-dialog-title" onClose={handleClose} style={{ paddingLeft: '20px', color: 'white' }}>
            {currentId ? 'Edit Transaction' : 'Add new Transaction'}
          </DialogTitle>
          <DialogContent dividers>


            <div className="customInputs">
              <select
                placeholder="Name"
                style={inputStyle}
                name='name'
                onChange={(e) => setTransactionData({ ...transactionData, name: e.target.value })}
                value={transactionData.name}
              >

                {toOptions(ACCOUNT_NAMES)}

              </select>

              <input
                placeholder="Amount"
                style={inputStyle}
                name='amount'
                type='number'
                onChange={(e) => setTransactionData({ ...transactionData, amount: e.target.value })}
                value={transactionData.amount}
              />

              <select
                placeholder="Type"
                style={inputStyle}
                name='type'
                onChange={(e) => setTransactionData({ ...transactionData, type: e.target.value })}
                value={transactionData.type}
              >
                <option value="">Choose Type</option>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>

              <input
                placeholder="Date"
                style={inputStyle}
                name='date'
                type='date'
                onChange={(e) => setTransactionData({ ...transactionData, date: e.target.value })}
                value={transactionData.date}
              />

              <input
                placeholder="Description"
                style={inputStyle}
                name='description'
                type='textarea'
                onChange={(e) => setTransactionData({ ...transactionData, description: e.target.value })}
                value={transactionData.description}
              />
            </div>

          </DialogContent>
          <DialogActions>
            <Button onClick={handleSubmitTransaction} variant="contained" style={{ marginRight: '25px' }} >
              Add Transaction
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
}

export default AddTransaction