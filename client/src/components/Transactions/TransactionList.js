/* eslint-disable */
import React, {useState, useEffect} from 'react'
import Transactions from './Transactions'
import AddTransaction from './AddTransaction'
import {getTransactions, getTransactionsByUser} from '../../actions/transactionActions'
import {useDispatch, useSelector} from 'react-redux'
import {useLocation, useHistory} from 'react-router-dom'
import NoData from '../svgIcons/NoData'
import Spinner from '../Spinner/Spinner'
import TransactionSearch from "./TransactionSearch";

const TransactionList = () => {

    const history = useHistory()
    const location = useLocation()
    const [open, setOpen] = useState(false)
    const [currentId, setCurrentId] = useState(null)
    const dispatch = useDispatch()
    const user = JSON.parse(localStorage.getItem('profile'))
    const {transactions} = useSelector((state) => state.transactions)
    const isLoading = useSelector(state => state.transactions.isLoading)
    // const transactions = []

    // useEffect(() => {
    // }, [currentId, dispatch]);

//     useEffect(() => {
//         dispatch(getTransactions(1));
//         // dispatch(getTransactionsByUser({userId : user?.result?._id}));
//         // dispatch(getTransactionsByUser({ search :user?.result?._id, tags: tags.join(',') }));
//     },[location]
// )

    useEffect(() => {
        dispatch(getTransactions());
    }, [location, dispatch])

    if (!user) {
        history.push('/login')
    }


    if (isLoading) {
        return <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            paddingTop: '20px'
        }}>
            <Spinner/>
        </div>
    }

    if (transactions.length === 0) {
        return <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            paddingTop: '20px',
            margin: '80px'
        }}>
            <NoData/>
            <p style={{padding: '40px', color: 'gray', textAlign: 'center'}}>No transactions yet. Click the plus icon to
                add transaction</p>

        </div>
    }

    return (
        <div>
            {/*<TransactionSearch/>*/}
            <AddTransaction
                open={open}
                setOpen={setOpen}
                currentId={currentId}
                setCurrentId={setCurrentId}
            />
            <Transactions
                open={open}
                setOpen={setOpen}
                currentId={currentId}
                setCurrentId={setCurrentId}
                transactions={transactions}
            />
        </div>
    )
}

export default TransactionList