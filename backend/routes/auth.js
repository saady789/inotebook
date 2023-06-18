//auth.js
const User = require('../models/User');
const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const router = express.Router();
const jwt = require("jsonwebtoken");

// Define your JWT secret key
const JWT_SECRET = "MySecretKey123!";


// localhost:5000/api/auth/createuser
router.post('/createuser', [
  body('email').isEmail(),
  body('name').isLength({ min: 3 }),
  body('password').isLength({ min: 5 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if the user already exists
    let user = await User.findOne({ email });
    let use = await User.findOne({ name });

    if (user) {
      return res.status(400).json({ error: 'This email has already been registered' });
    }
    if (use) {
        return res.status(400).json({ error: 'This username already exists. Please try with something else ' });
      }
      //Hashing password with salr & pepper
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(password,salt);

    // Create a new user
    user = new User({
      name,
      email,
      password: secPass
    });

    // Save the user to the database
    await user.save();
    //JWT Auth
    const data = {
        user:{
            id:user.id
        }
    }
    const authToken = jwt.sign(data,JWT_SECRET);
    
    res.json({authToken});


  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;





























// //auth.js
// const User = require('../models/User');
// const express = require('express');
// const router = express.Router();
// const {body,validationResult} = require('express-validator');


// //Creating Users And Posting Their Data On MongoDB


// router.get('/',[
//     body('email').isEmail(),
//     body('name').isLength({min:3}),
//     body('password').isLength({min:5})
// ], (req, res) => {
//   const errors = validationResult(req);
//   if(!errors.isEmpty()){
//     return res.status(400).json({errors:errors.array()});
//   }

// //   const user = User(req.body);
// //   user.save();
//   User.create({
//     name:req.body.name,
//     password:req.body.password,
//     email:req.body.email
//   }).then((user)=>res.json(user))
// //   res.send(req.body);
// //   console.log(req.body);
// });

// module.exports = router;

