const userModel = require("../model/userSchema");
const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");


// SingUp

const signup = async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  console.log(name, email, password, confirmPassword);

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({
      succuess: false,
      message: "Please provide all the details",
    });

  }

  const  validEmail = emailValidator.validate(email);
  if (!validEmail) {
    return res.status(400).json({
      succuess: false,
      message: "Please provide valid email id",
    });

  }
  if (password !== confirmPassword) {
    return res.status(400).json({
      succuess: false,
      message: "Password and confirm password should be same",
    });

  }

  try {
    const userInfo = userModel(req.body);

    const result = await userInfo.save();

    return res.status(200).json({
      succuess: true,
      Date: result
    });
  } catch (e) {

    if (e.code === 11000) {
      return res.status(400).json({
        succuess: false,
        message: 'Account already exists with provided email id'
      });

    }
    return res.status(400).json({
      succuess: false,
      message: e.message,
    });
  
  }
};
//  SingIn

const singin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      succuess: false,
      message: "Every field is mandatory",
    });

  }

  try {
    const user = await userModel
  .findOne({
    email
  })
  .select("+password");

  if (!user || (await bcrypt.compare(password, user.password))) {
    return res.status(400).json({
      succuess: false,
      message: "invalid credentials",
  })

}

// JWT token

  const token = user.jwtToken();
user.password = undefined;

const cookieOption = {
  maxAge: 24 * 60 * 60 * 1000,
};

res.cookie("token", token, cookieOption);
res.status(200).json({
  succuess: true,
  data: user
})
  } catch (e) {
    res.status(400).json({
      succuess: false,
      message: e.message,
    })
   
  }

  userModel.findOne({ email: email }, (err, user) => {
    if (err) {
      return res.status(400).json({
        succuess: false,
        message: "Something went wrong",
      });
    }
    if (!user) {
      return res.status(400).json({
        succuess: false,
        message: "User not found",
      });
    }
    if (user.password !== password) {
      return res.status(400).json({
        succuess: false,
        message: "Invalid password",
      });
    }
    return res.status(200).json({
      succuess: true,
      message: "Login Successfull",
    });
  });
}

// ++++++++++++++++++getUser+++++++++++++++

const getUser = (req, res, next) => {
    const userId = req.user.id;


    try {
      const user = userModel.findById(userId);
      return res.status(200).json({
        succuess: true,
        data: user
      })
    } catch (e) {
      return res.status(400).json({
        succuess: false,
        message: e.message,
      })
    }
}

// +++++++++++++++++++++logout details++++++++++++++++++
const logout = (req, res) => {
  try {
    const cookieOption = {
      expires: new Date(),
      httpOnly: true,
    };
    res.cookie("token", null, cookieOption);
    req.status(200).json({
      succuess: true,
      message: "Logged Out"
    })
  } catch (e) {
    res.status(401).json({
      succuess: false,
      message: e.message,
    })
    
  }

}

module.exports = {
  signup,
  singin, 
  getUser
}
