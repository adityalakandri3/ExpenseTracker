const transporter = require("../config/emailConfig");
const { hashedPassword, matchPassword } = require("../middleware/Auth");
const sendEmailVerificationOtp = require("../middleware/EmailVerifyOtp");
const emailVerificationModel = require("../model/OtpModel");
const User = require("../model/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userValidationSchema = require("../helper/userValidationSchema");
const fs = require("fs");
const Expense = require("../model/ExpenseModel");
const Category = require("../model/CategoryModel");
const Budget = require("../model/BudgetModel");

class UserController {
  //User Create function
  async createUser(req, res) {
    // console.log(req.body)
    try {
      const { name, email, password, role, phone, location } = req.body;
      const { error } = userValidationSchema.validate(req.body ,{ allowUnknown: true });

      if (error) {
        return res.status(400).json({
          status: false,
          message: "Validation failed",
          errors: error.details.map((err) => err.message),
        });
      }
      // Checking if all the fields are present
      if (
        !name ||
        !email ||
        !password ||
        !phone ||
        !location?.state ||
        !location?.city
      ) {
        return res.status(400).json({
          status: false,
          message: "All fields are required.",
        });
      }

      // Hashing password
      const hashPassword = await hashedPassword(password);

      // Saving the data in the database
      const data = new User({
        name,
        email,
        password: hashPassword,
        role,
        phone,
        location,
      });
      if (req.file) {
        data.image = req.file.path;
      }

      const user = await data.save();

      sendEmailVerificationOtp(req, user);

      return res.status(200).json({
        status: true,
        message: "User registered and OTP sent successfully.",
        data: user,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: `Something went wrong while creating user: ${error.message}`,
      });
    }
  }
  //Verify OTP
  async verifyOTP(req, res) {
    try {
      const { email, otp } = req.body;

      //Checking if any of the fields are empty
      if (!email || !otp) {
        return res.status(400).json({
          status: false,
          message: "All fields are required.",
        });
      }

      //checking if email exists
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return res.status(400).json({
          status: false,
          message: "Email doesn't exist.",
        });
      }

      //checking if the email id is verified
      if (existingUser.is_verified) {
        return res.status(400).json({
          status: false,
          message: "Email is already Verified.",
        });
      }

      //checking if there is matching verification otp
      const emailVerification = await emailVerificationModel.findOne({
        user_id: existingUser._id,
        otp,
      });
      //matching OTP
      if (!emailVerification) {
        if (!existingUser.is_verified) {
          await sendEmailVerificationOtp(req, existingUser);
          return res.status(400).json({
            status: false,
            message: "Invalid OTP. New OTP has been sent to your email.",
          });
        }
        return res.status(400).json({
          status: false,
          message: "Invalid OTP.",
        });
      }

      //checking expiration time
      const currentTime = new Date();
      const expirationTime = new Date(
        emailVerification.created_At.getTime() + 15 * 60 * 1000
      );

      if (currentTime > expirationTime) {
        await sendEmailVerificationOtp(req, existingUser);
        return res.status(400).json({
          status: false,
          message: "OTP expired. New OTP has been sent to your email.",
        });
      }
      //if otp is valid is verified is set to true ans saved
      existingUser.is_verified = true;
      await existingUser.save();

      //after saving the data the otp and data in the database is deleted.
      await emailVerificationModel.deleteMany({ userId: existingUser._id });
      return res.status(200).json({
        status: true,
        message: "Email Verified Successfully",
      });
    } catch (error) {
      res.status(400).json({
        status: true,
        message: `Something went wrong,${error.message}`,
      });
    }
  }
  //User Login function
  async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      //checking if the fields are present or not
      if (!email || !password) {
        return res.status(400).json({
          status: false,
          message: "All fields are required",
        });
      }

      //finding email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          status: false,
          message: "Email doesn't exist.",
        });
      }

      if (!user.is_verified) {
        return res.status(400).json({
          status: false,
          message: "User not verified.",
        });
      }

      //Matching password
      const isMatch = await matchPassword(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          status: false,
          message: "Incorrect Password.",
        });
      }
    
      //create token
      const token = jwt.sign(
        {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          location: user.location,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        status: true,
        message: "Login Successful.",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          is_verified: user.is_verified,
          location: user.location,
        },
        token: token,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: `Something went wrong while logging in.${error.message}`,
      });
    }
  }
  //update password
  async updatePassword(req, res) {
    try {
      const userId = req.user._id;
      const { password, confirmPassword } = req.body;

      // Validate both fields
      if (!password || !confirmPassword) {
        return res.status(400).json({
          status: false,
          message: "Both password and confirm password are required",
        });
      }

      // Check if passwords match
      if (password !== confirmPassword) {
        return res.status(400).json({
          status: false,
          message: "Passwords do not match",
        });
      }

      // Hash the new password
      const newPassword = await hashedPassword(password);

      // Update user's password
      await User.findByIdAndUpdate(userId, {
        $set: { password: newPassword },
      });

      return res.status(200).json({
        status: true,
        message: "Password updated successfully",
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: `Something went wrong: ${err.message}`,
      });
    }
  }
  //reset password link
  async resetPasswordLink(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          status: false,
          message: "Email is required.",
        });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          status: false,
          message: "Email doesn't exist.",
        });
      }

      const secret = user._id + process.env.JWT_SECRET_KEY;
      const token = jwt.sign({ userId: user._id }, secret, {
        expiresIn: "20m",
      });

      let resetLink = `${process.env.FRONT_END_HOST}/account/reset-password/${user._id}/${token}`;

      console.log("Reset Link:", resetLink);

      await transporter.sendMail({
        from: process.env.EMAIL_HOST,
        to: user.email,
        subject: "Password Reset Link",
        html: `<h5>Hello, ${user.name},</h5><h5>Please <a href="${resetLink}">Click here</a> to reset your password.</h5>`,
      });

      return res.status(200).json({
        status: true,
        message: "Email to reset password has been sent successfully.",
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }
  //reset password
  async resetPassword(req, res) {
    try {
      const { password, confirmPassword } = req.body;
      const { id, token } = req.params;

      const user = await User.findById(id);
      if (!user) {
        return res.status(400).json({
          status: false,
          message: "User not found.",
        });
      }

      // Validate token
      const newSecret = user._id + process.env.JWT_SECRET_KEY;
      jwt.verify(token, newSecret);

      // Both fields are required
      if (!password || !confirmPassword) {
        return res.status(400).json({
          status: false,
          message: "Both fields are required.",
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({
          status: false,
          message: "Password and Confirm Password don't match.",
        });
      }

      // Generate salt and hash password
      const salt = await bcrypt.genSalt(10);
      const newHashPassword = await bcrypt.hash(password, salt);

      // Update password
      await User.findByIdAndUpdate(user._id, {
        $set: { password: newHashPassword },
      });

      return res.status(200).json({
        status: true,
        message: "Password reset successful.",
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: `Unable to reset password: ${error.message}`,
      });
    }
  }
  //dashboard
  async userDashboard(req, res) {
    const userId = req.user._id;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found",
        });
      }
      return res.status(200).json({
        status: true,
        message: "Welcome to the Dashboard",
        data: {
          id: user._id,
          name: user.name,
          role: user.role,
          email: user.email,
          phone: user.phone,
          location: user.location,
          image: user.image,
        },
      });
    } catch (error) {
      // Handle any errors during the database query
      return res.status(500).json({
        status: false,
        message: `Something went wrong: ${error.message}`,
      });
    }
  }
  //edit User
  async editUser(req, res) {
    try {
      const { id } = req.params;
      const edit = await User.findById(id);
      if (!edit) {
        return res.status(400).json({
          status: false,
          message: "User not found.",
        });
      }
      return res.status(200).json({
        status: true,
        message: "User fetched successfully.",
        data: edit,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: `Something went wrong,${error.message}.`,
      });
    }
  }
  //update User
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, phone, location } = req.body;
      //checking if all the fields are present
      if (!name || !phone || !location?.state || !location?.city) {
        return res.status(400).json({
          status: false,
          message: "All fields are required.",
        });
      }
      const user = await User.findById(id);

      if (user.image) {
        fs.unlink(user.image, (err) => {
          if (err) {
            console.log("error deleting image.")
          } else {
            console.log("Image deleted.");
          }
        });
      }
      const updatedData = {
        name,
        phone,
        location,
      };
      if (req.file) {
        updatedData.image = req.file.path;
      }
      const update = await User.findByIdAndUpdate(id, updatedData, {
        new: true,
      });
      return res.status(200).json({
        status: true,
        message: "User Updated Succesfully.",
        data: update,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: `Something went wrong whie updating user.${error.message}`,
      });
    }
  }
  //reset data

  async resetUserData(req, res) {
    try {
      const userId = req.user._id;

      await Expense.deleteMany({ user: userId });
      await Category.deleteMany({ createdBy: userId });
      await Budget.deleteMany({ user: userId });

      return res.status(200).json({
        status: true,
        message: "All your data has been reset.",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

module.exports = new UserController();
