//Copyright (c) 2022 Panshak Solomon

import express from 'express'
import mongoose from 'mongoose'

import TransactionModel from '../models/TransactionModel.js'

export const getTransactionsByUser = async (req, res) => {
    const {searchQuery} = req.query;

    try {
        const transactions = await TransactionModel.find({creator: searchQuery});

        res.status(200).json({data: transactions});
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}


export const getTotalCount = async (req, res) => {
    const {searchQuery} = req.query;

    try {
        // const transactions = await TransactionModel.find({ creator: searchQuery });
        const totalCount = await TransactionModel.countDocuments({creator: searchQuery});

        res.status(200).json(totalCount);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}


export const getTransactions = async (req, res) => {

    try {
        const allTransactions = await TransactionModel.find({}).sort({_id: -1})
        res.status(200).json({data: allTransactions});
    } catch (error) {
        res.status(409).json(error.message)
    }
}


export const createTransaction = async (req, res) => {

    const transaction = req.body

    const newTransaction = new TransactionModel(transaction)

    try {
        await newTransaction.save()
        res.status(201).json(newTransaction)
    } catch (error) {
        res.status(409).json(error.message)
    }

}

export const getTransaction = async (req, res) => {
    const {id} = req.params;

    try {
        const transaction = await TransactionModel.findById(id);

        res.status(200).json(transaction);
    } catch (error) {
        res.status(409).json({message: error.message});
    }
}


export const updateTransaction = async (req, res) => {
    const {id: _id} = req.params
    const transaction = req.body

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No transaction with that id')

    const updatedTransaction = await TransactionModel.findByIdAndUpdate(_id, {...transaction, _id}, {new: true})

    res.json(updatedTransaction)
}


export const deleteTransaction = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No transaction with that id')

    await TransactionModel.findByIdAndRemove(id)

    res.json({message: 'Transaction deleted successfully'})
}