import express from 'express'
import {getTransactions, createTransaction, updateTransaction, deleteTransaction, getTransactionsByUser} from '../controllers/transactions.js'

const router = express.Router()

router.get('/get', getTransactions)
router.get('/user', getTransactionsByUser);
router.post('/', createTransaction)
router.patch('/:id', updateTransaction)
router.delete('/:id', deleteTransaction)

export default router