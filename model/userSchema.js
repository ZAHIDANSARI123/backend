const mongoose = require("mongoose");
const { Shema } = mongoose;
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "user name is required"],
    minLenght: [3, " name must be at least 3 char"],
    mixLenght: [15, " name must be at most 15 char"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    lowercase: true,
    unique: [true, "already registered"],
  },
  password: {
    type: String,
  },
  forgotPasswordToken: {
    type: String,
  },
  forgotPasswordExpiryData: {
    type: String,
  },
},{
  timestamps: true
});

// +++++++++++password change and modify+++++++++++

userSchema.pre("save", async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  return next();

})

// JWT token generate

userSchema.method = {
  jwtToken() {
    return JWT.sign(
      {id: this._id, email: this.email},
      process.env.SECRET,
      {expiresIn: '24'}
    )
  }
}

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
