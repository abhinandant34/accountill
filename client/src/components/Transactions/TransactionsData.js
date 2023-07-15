import React from 'react'
import { TotalCredit, TotalDebit,TotalTransactions,TotalBalance} from '../../actions/transactionActions'

const Datastyle ={
    width:'100%',
    display:'flex',
    justifyContent:'center',
    gap:'10vw',
    flexWrap:'wrap',
    margin:'3vh'

}
const Divstyle={
    fontSize:'2rem',
    padding:'2px',
    margin:'1vw'
}

function TransactionsData({transactions}) {
  return (
    <div style={Datastyle}>
        <div style={{Divstyle, color:'red'}}>
            Total Credit: {TotalCredit(transactions)}
        </div>
        <div style={{Divstyle, color:'green'}}>
            Total Debit:  {TotalDebit(transactions)}
        </div>
        <div style={{Divstyle, color:'red'}}>
            Total Transactions: {TotalTransactions(transactions)}
        </div>
        <div style={{Divstyle, color:'green'}}>
            Total Balance:   {TotalBalance(transactions)}
        </div>
    </div>
  )
}

export default TransactionsData