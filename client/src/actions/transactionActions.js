import * as api from '../api/index'
import * as XLSX from "xlsx";
import {
    ADD_NEW,
    UPDATE,
    DELETE,
    START_LOADING,
    END_LOADING,
    FETCH_CLIENT,
    FETCH_CLIENTS_BY_USER,
    ADD_NEW_CLIENT, UPDATE_CLIENT, DELETE_CLIENT, FETCH_ALL
} from './constants'


export const getTransaction = (id) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        const { data } = await api.fetchTransaction(id);
        dispatch({ type: FETCH_CLIENT, payload: { transaction: data } });

    } catch (error) {
        console.log(error);
    }
};


export const getTransactionsWithSearch =(payload) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING })
        console.log(" the payload is :",payload)
        const  { data: { data } } = await api.fetchTransactionsWithSearch(payload)

        dispatch({ type: FETCH_ALL, payload: {data : data} });
        dispatch({ type: END_LOADING })
    } catch (error) {
        console.log(error.response)

    }
}

export const getTransactions =() => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING })
        const  { data: { data } } = await api.fetchTransactions()

        dispatch({ type: FETCH_ALL, payload: {data : data} });
        dispatch({ type: END_LOADING })
    } catch (error) {
        console.log(error.response)

    }
}

export const getTransactionsByUser =(searchQuery) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING })
        const  { data: { data } } = await api.fetchTransactionsByUser(searchQuery)

        dispatch({ type: FETCH_CLIENTS_BY_USER, payload: data });
        dispatch({ type: END_LOADING })
    } catch (error) {
        console.log(error.response)

    }
}


export const createTransaction =(transaction, openSnackbar) => async (dispatch) => {

    try {
        const { data } = await api.addTransaction(transaction)
        dispatch({ type: ADD_NEW_CLIENT, payload: data })
        openSnackbar("Transaction added successfully")

    } catch (error) {
        console.log(error)
    }
}

export const uploadTransactionsFile = (file, openSnackbar) => async (dispatch) => {
    const formData = new FormData();
    formData.append("file", file);
    console.log(file);
    try {
      const response = await api.uploadTransFile(formData);
      dispatch({ type: ADD_NEW_CLIENT, payload: response.data });
      openSnackbar("File uploaded successfully");
    } catch (error) {
      console.log(error);
    }
  };

 export const downloadTransactions = async () => {
    try {
        const response = await api.fetchTransactions()
    let transactions=response.data.data
    console.log(transactions);
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(transactions);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "transactions.xlsx";
      link.click();
      console.log("Transactions exported successfully");
    } catch (error) {
      console.error("Error exporting transactions:", error);
    }
  };

export const updateTransaction =(id, transaction, openSnackbar) => async (dispatch) => {

    const { data } = await api.updateTransaction(id, transaction)
    dispatch({ type: UPDATE_CLIENT, payload: data })
    openSnackbar("Transaction updated successfully")
    try {

    } catch (error) {
        console.log(error)
    }
}

export const deleteTransaction =(id, openSnackbar) => async (dispatch) => {
    try {
        await api.deleteTransaction(id)

        dispatch({type: DELETE_CLIENT, payload: id})
        openSnackbar("Customer deleted successfully")
    } catch (error) {
        console.log(error)
    }
}
