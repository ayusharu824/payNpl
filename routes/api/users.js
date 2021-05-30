const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");

// @route  GET api/users
// @desc   Test route
// @access public
router.get(`/`, (req, res) => {
  res.send(`Users Routes`);
});

// @route  Post api/users
// @desc   Register user
// @access public

router.post(
  "/RegisterUser",
  [
    check("fullName", "Name is required").not().isEmpty(),
    check("emailID", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({
      min: 6,
    }),
    check("INMobileNo", "IN Mobile No. should be numeric").isNumeric(),
    check("NpMobileNo", "NP Mobile No. should be numeric").isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    debugger;
    const {
      fullName,
      emailID,
      NpMobileNo,
      INMobileNo,
      password,
      Latitude,
      Longitude,
      appVersion,
      OsType,
      PushToken,
      CreatedDate,
      CreatedBy,
      IsActive,
    } = req.body;
    try {
      // see if user exists
      //   let user = await User.findOne({ emailID});
      var query = {
        $or: [
          { emailID: { $exists: true, $nin: [null, ""], $eq: emailID } },
          { INMobileNo: { $exists: true, $nin: [null, ""], $eq: INMobileNo } },
          { NpMobileNo: { $exists: true, $nin: [null, ""], $eq: NpMobileNo } },
        ],
      };
      let user = await User.findOne(query);
      if (user) {
        var duplicateErrorMsg = [];
        if (user.emailID == emailID) {
          duplicateErrorMsg.push(`Email ID already exists`);
        }
        if (user.NpMobileNo == NpMobileNo) {
          duplicateErrorMsg.push(`Np Mobile No. already exists`);
        }
        if (user.INMobileNo == INMobileNo) {
          duplicateErrorMsg.push(`IN Mobile No. already exists`);
        }
        return res.status(400).json({ errors: duplicateErrorMsg });
      }
      user = new User({
        fullName,
        emailID,
        NpMobileNo,
        INMobileNo,
        password,
        Latitude,
        Longitude,
        appVersion,
        OsType,
        PushToken,
        CreatedDate,
        CreatedBy,
        IsActive,
      });

      // Encrypt password not now
      //   const salt = await bcrypt.genSalt(8);
      //   user.password = await bcrypt.hash(password, salt);
      await user.save();
      console.log(user);
      // Return JWT not now
      res.status(200).send(`User Registered`);
    } catch (err) {
      console.error(err.message);
      res.status(500).send(`Server Error`);
    }
  }
);

// @route  Post api/users
// @desc   Login user
// @access public

router.post(
  `/LoginUser`,
  [
    check("username", "User Name is required").not().isEmpty(),
    check("password", "Password should be of atleast 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()});
    }
    console.log(req.body)
    console.log(typeof(req.body.username))
    const {username, password} = req.body
    try {
      var query = {$and:[{ $or:[{emailID: username}, {NpMobileNo: username}, {INMobileNo: username}]},{password}]}
      const user = await User.findOne(query)
      if(user){
        console.log(user)
        res.status(200).json({user})
      }else{
        res.status(400).json({msg:`Invalid credentials`})
      }
    } catch (error) {
      console.log(error.message)
      res.status(500).send(`server error`)
    }
  }
);

module.exports = router;
