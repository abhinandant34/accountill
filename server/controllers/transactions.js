import express from "express";
import mongoose from "mongoose";
import TransactionModel from "../models/TransactionModel.js";
import multer from "multer";
import XLSX from "xlsx";
import fs from "fs";

const uploadsFolderName = "uploads";

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsFolderName); // Specify the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Generate a unique filename
  },
});

try {
  if (!fs.existsSync(uploadsFolderName)) {
    console.log("Directory Does exists, creating now: ");
    fs.mkdirSync(uploadsFolderName);
  }
} catch (e) {
  console.log("An error occurred.");
}
const upload = multer({ storage: storage });
export const uploadTransactionsFile = async (req, res) => {
  try {
    // Handle the uploaded file using multer middleware
    upload.single("file")(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred during file upload
        return res.status(400).json({ message: "File upload error"+ err });
      } else if (err) {
        // An unknown error occurred during file upload
        return res
          .status(500)
          .json({ message: "Server error: " + err.message });
      }

      console.log("The file is :",req.file);

      // File upload was successful
      if (!req.file) {
        // No file was uploaded
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Access the uploaded file information
      const file = req.file;
      try {
        // Read the Excel file
        const workbook = XLSX.readFile(file.path, { cellDates: true });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          raw: false,
          header:1,
          blankrows: false,
        });

        // console.log("the data is ", jsonData)

        let counterForRows = 0;

        // Process and upload the extracted data to the database
        const transactions = jsonData.map((data) => {
          counterForRows++;

          const { title, amount, type, date, description } = data;

          if (
            title === undefined ||
            amount === undefined ||
            type === undefined ||
            date === undefined
          ) {
            return res
              .status(422)
              .json({ message: "Invalid Data on row: " + counterForRows });
          }

          // Create a new transaction object
          const transaction = new TransactionModel({
            title,
            amount,
            type,
            description,
            date,
          });

          return transaction;
        });
        // Save the transactions to the database
        await TransactionModel.insertMany(transactions);

        // Delete the uploaded file
        fs.unlinkSync(file.path);

        res.status(200).json({ message: "File data uploaded successfully" });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error processing file data" });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getTransactionsByUser = async (req, res) => {
  const { searchQuery } = req.query;

  try {
    const transactions = await TransactionModel.find({ creator: searchQuery });

    res.status(200).json({ data: transactions });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getTransactionsBySearch = async (req, res) => {
  const { name, amount, description, type, date } = req.body; // Destructure the values from req.body

  let searchParams = {};

  if (name) {
    searchParams.name = name;
  }

  if (amount) {
    searchParams.amount = amount;
  }

  if (description) {
    searchParams.description = description;
  }

  if (type) {
    searchParams.type = type;
  }
  if (date) {
    searchParams.date = date.concat("T18:30:00.000Z");
  }
  try {
    let transactions;
    if (Object.keys(searchParams).length === 0) {
      transactions = await TransactionModel.find().sort({ createdAt: -1 });
    } else {
      transactions = await TransactionModel.find(searchParams).sort({
        createdAt: -1,
      });
    }
    res.status(200).json({ data: transactions });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getTotalCount = async (req, res) => {
  const { searchQuery } = req.query;

  try {
    // const transactions = await TransactionModel.find({ creator: searchQuery });
    const totalCount = await TransactionModel.countDocuments({
      creator: searchQuery,
    });

    res.status(200).json(totalCount);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const allTransactions = await TransactionModel.find({}).sort({ _id: -1 });
    res.status(200).json({ data: allTransactions });
  } catch (error) {
    res.status(409).json(error.message);
  }
};

export const createTransaction = async (req, res) => {
  const transaction = req.body;

  const newTransaction = new TransactionModel(transaction);

  try {
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(409).json(error.message);
  }
};

export const getTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await TransactionModel.findById(id);

    res.status(200).json(transaction);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateTransaction = async (req, res) => {
  const { id: _id } = req.params;
  const transaction = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No transaction with that id");

  const updatedTransaction = await TransactionModel.findByIdAndUpdate(
    _id,
    { ...transaction, _id },
    { new: true }
  );

  res.json(updatedTransaction);
};

export const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No transaction with that id");

  await TransactionModel.findByIdAndRemove(id);

  res.json({ message: "Transaction deleted successfully" });
};
