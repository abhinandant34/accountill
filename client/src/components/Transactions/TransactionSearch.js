/* eslint-disable */
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@material-ui/core";
import { toOptions } from "../../utils/utils";
import { ACCOUNT_NAMES } from "../../actions/constants";
import { getTransactionsWithSearch } from "../../actions/transactionActions";
import SearchIcon from '@mui/icons-material/Search';

const TransactionSearch = () => {
  const dispatch = useDispatch();
  const [searchFilters, setSearchFilters] = useState({
    name: "",
    amount: "",
    type: "",
    date: "",
    description: "",
  });

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters({ ...searchFilters, [name]: value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(getTransactionsWithSearch(searchFilters));
  };

  return (
    <div >
      <form onSubmit={handleSearchSubmit} style={{width:'100%',display:'flex',justifyContent:'center',gap:'5vw',fontSize:'1rem'}}> 
        <input        
          className="input-search"
          type="text"
          name="name"
          value={searchFilters.name}
          onChange={handleSearchChange}
          placeholder="Search by name"
        />

        <input        
          className="input-search"
          type="text"
          name="amount"
          value={searchFilters.amount}
          onChange={handleSearchChange}
          placeholder="Search the amount"
        />

        <input
          className="input-search"
          type="date"
          name="date"
          value={searchFilters.date}
          onChange={handleSearchChange}
          placeholder="Search by date"
        />

        <select name="type" value={searchFilters.type} onChange={handleSearchChange}>
            <option value="">Select the type</option>
            <option value="Credit">Credit</option>
            <option value="Debit">Debit</option>
        </select>

        <button type="submit" style={{display:'flex',padding:'.5vh'}}><SearchIcon style={{fontSize:'.8rem'}}/>Search</button>
      </form>
    </div>
  );
};

export default TransactionSearch;
