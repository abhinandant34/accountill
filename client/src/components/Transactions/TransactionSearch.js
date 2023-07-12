/* eslint-disable */
import React, {useState, useEffect} from 'react'
import {Container} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {toOptions} from "../../utils/utils";
import {ACCOUNT_NAMES} from "../../actions/constants";
import {getTransactionsWithSearch} from "../../actions/transactionActions";

const TransactionSearch = () => {

    const dispatch = useDispatch()
    const [searchFilters, setSearchFilters] = useState({ name: '', amount: '', type: '', date: "", description: '' })
    const {transactions} = useSelector((state) => state.transactions)

    useEffect(() => {
        dispatch(getTransactionsWithSearch());
    }, [searchFilters])

    return (
        <div>
            <Container style={{width: '85%'}}>
                <select name="name" placeholder="Search with name"
                   onChange={(e) => setSearchFilters({ ...searchFilters, name: e.target.value })}
                       value={searchFilters.name}
                >
                    <option value="">Choose Account</option>
                    {toOptions(ACCOUNT_NAMES)}
                </select>
            </Container>
        </div>
    )
}

export default TransactionSearch