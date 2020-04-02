const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator/check");
const gravatar = require("gravatar");

const User = require("../../models/User");

//@route    POST api/users
//@desc     Register Use
//@access   Public
router.post(
  "/",
  [
    check("name", "name is required")
      .not()
      .isEmpty(),
    check("email", "please include email").isEmail(),
    check("password", "password should be 6 or more characters").isLength({
      min: 6
    })
  ],
  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      //see if the user exists
      let user = await User.findOne({ email: email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "user already exist" }] });
      }
      //get users gravatar

      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm" //default avatar
      });

      user = new User({
        name,
        email,
        password,
        avatar
      });
      // Encrypt the password

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt); //cretaes a hass for the password

      await user.save();
      //return jsonwebtoken

      res.send("User Registered");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  }
);

module.exports = router;
