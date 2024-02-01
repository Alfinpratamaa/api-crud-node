const express = require("express");
const {
  getAllAccounts,
  getAccountDetail,
  createAccount,
  updateAccount,
  deleteAccount,
} = require("../controllers/addAcount");

const router = express.Router();
// get data
router.get("/accounts", getAllAccounts);
router.get("/account/:id", getAccountDetail);

// create data
router.post("/account/new", createAccount);

// update and delete data
router.route("/account/:id").put(updateAccount).delete(deleteAccount);

module.exports = router;
