const Account = require("../models/addAccount");
const bcrypt = require("bcrypt");

// create a new account
exports.createAccount = async (req, res, next) => {
  try {
    // cek jika akun sudah ada
    const existingAccount = await Account.findOne({ email: req.body.email });
    if (existingAccount) {
      return res.status(400).json({
        success: false,
        error: "Account with this email already exists",
      });
    }

    if (!req.body.fullname || !req.body.email || !req.body.password) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const accountData = {
      fullname: req.body.fullname,
      email: req.body.email,
      password: hashedPassword,
    };

    const account = await Account.create(accountData);
    res.status(201).json({
      success: true,
      data: account.fullname,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// get all accounts

exports.getAllAccounts = async (req, res, next) => {
  try {
    const accounts = await Account.find();

    const dataAccount = accounts.map((account) => ({
      _id: account._id,
      fullname: account.fullname,
      email: account.email,
    }));
    res.status(200).json({
      success: true,
      data: dataAccount,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// get account by id
exports.getAccountDetail = async (req, res, next) => {
  const account = await Account.findById(req.params.id);

  if (!account) {
    return res.status(500).json({
      success: false,
      message: "Account not Found",
    });
  }

  res.status(200).json({
    success: true,
    account,
  });
};

// update account
exports.updateAccount = async (req, res, next) => {
  try {
    const accountId = req.params.id; // Assuming you get the account ID from the request parameters

    // Check if the account exists
    const existingAccount = await Account.findById(accountId);
    if (!existingAccount) {
      return res.status(404).json({
        success: false,
        error: "Account not found",
      });
    }

    // Check if the new email is already in use by another account
    if (req.body.email && req.body.email !== existingAccount.email) {
      const emailExists = await Account.findOne({ email: req.body.email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          error: "Email is already in use by another account",
        });
      }
    }
    if (!req.body.fullname || !req.body.email || !req.body.password) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    // Update account fields
    existingAccount.fullname = req.body.fullname || existingAccount.fullname;
    existingAccount.email = req.body.email || existingAccount.email;

    // If updating the password, hash the new password
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      existingAccount.password = hashedPassword;
    }

    // Save the updated account
    const updatedAccount = await existingAccount.save();

    res.status(200).json({
      success: true,
      data: updatedAccount.email,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// delete account
exports.deleteAccount = async (req, res, next) => {
  const account = await Account.findById(req.params.id);

  if (!account) {
    return next(new ErrorHandler("Account not found ", 404));
  }

  // ======================================

  // another trick to delete one record

  await account.deleteOne({ _id: req.params.id });

  //   =====================================

  // await Item.findOneAndDelete();

  res.status(200).json({
    success: true,
    message: "Account delete successfully",
  });
};
