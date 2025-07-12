const userValidationSchema = require("../helper/userValidationSchema");
const { hashedPassword, matchPassword } = require("../middleware/Auth");
const Admin = require("../model/AdminModel");
const fs = require("fs");
const path = require("path");
const createToken = require("../helper/createTokenforAdmin");
const jwt = require("jsonwebtoken");
const transporter = require("../config/emailConfig");
const bcrypt = require("bcryptjs");
class AdminController {
  //admin middleware
  async CheckAuth(req, res, next) {
    console.log(req.user);
    try {
      if (req.user) {
        next();
      } else {
        res.redirect("/admin/login");
      }
    } catch (err) {
      console.log(err);
    }
  }
  //create admin
  async createAdmin(req, res) {
    try {
      const { name, email, password, role, phone, location } = req.body;

      const { error } = userValidationSchema.validate(req.body);

      if (error) {
        if (req.file) {
          fs.unlink(req.file.path, (err) => {
            if (err)
              console.error(
                "Error deleting uploaded image on validation fail:",
                err
              );
          });
        }
        req.flash(
          "error",
          error.details.map((err) => err.message)
        );
        return res.redirect("/admin/register");
      }

      if (
        !name ||
        !email ||
        !password ||
        !phone ||
        !location.state ||
        !location.city
      ) {
        if (req.file) {
          fs.unlink(req.file.path, (err) => {
            if (err)
              console.error(
                "Error deleting uploaded image on missing field:",
                err
              );
          });
        }
        req.flash("error", "All fields are required.");
        return res.redirect("/admin/register");
      }

      const hashPassword = await hashedPassword(password);

      const data = new Admin({
        name,
        email,
        password: hashPassword,
        role,
        phone,
        location,
      });

      if (req.file) {
        data.image = req.file.path.replace(/\\/g, "/");
      }

      await data.save();
      req.flash("message", "Admin created successfully.");
      return res.redirect("/admin/login");
    } catch (error) {
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err)
            console.error("Error deleting uploaded image on catch:", err);
        });
      }
      req.flash(
        "error",
        `Something went wrong while creating admin.${error.message}`
      );
      return res.redirect("/admin/register");
    }
  }

  //register view
  async registerView(req, res) {
    try {
      const message = req.flash("message")[0];
      const error = req.flash("error")[0];

      return res.render("register", {
        title: "Admin Register",
        message,
        error,
      });
    } catch (error) {
      req.flash("error", `Something went wrong,${error.message}`);
      return res.redirect("/admin/404-not-found");
    }
  }
  //loginView
  async loginView(req, res) {
    try {
      const message = req.flash("message")[0];
      const error = req.flash("error")[0];
      return res.render("login", {
        title: "Admin Login",
        message,
        error,
      });
    } catch (error) {
      req.flash("error", `Something went wrong,${error.message}`);
      return res.redirect("/admin/404-not-found");
    }
  }
  //login admin
  async loginAdmin(req, res) {
    try {
      const { email, password } = req.body;

      //checking if the fields are present or not
      if (!email || !password) {
        req.flash("error", "All fields are required.");
        return res.redirect("/admin/login");
      }

      //finding email
      const admin = await Admin.findOne({ email });
      if (!admin) {
        req.flash("error", "Admin doesnot exist.");
        return res.redirect("/admin/login");
      }

      //Matching password
      const isMatch = await matchPassword(password, admin.password);
      if (!isMatch) {
        req.flash("error", "Incorrect password.");
        return res.redirect("/admin/login");
      }
      const tokendata = await createToken({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        phone: admin.phone,
        location: admin.location,
        image: admin.image,
        is_verified: admin.is_verified,
      });
      if (tokendata) {
        res.cookie("adminToken", tokendata);
        console.log("Admin logged in");
        req.flash("message", "Admin login successful.");
        return res.redirect("/admin/");
      } else {
        req.flash("error", `Login Failed.${error.message}`);
        return res.redirect("/admin/login");
      }
    } catch (error) {
      req.flash("error", `${error.message}`);
      return res.redirect("/admin/login");
    }
  }
  //admin/
  async home(req, res) {
    try {
      const message = req.flash("message");
      const error = req.flash("error");
      console.log(req.user);
      res.render("home", {
        title: "Home",
        message,
        user: req.user,
        error
      });
    } catch (error) {
      req.flash("error", `${error.message}`);
      return res.redirect("/admin/");
    }
  }
  //admin dashboard
  async dashboard(req, res) {
    try {
      res.render("admindashboard", {
        user: req.user,
      });
      console.log(req.user);
    } catch (error) {
      req.flash("error", `${error.message}`);
      return res.redirect("/admin-404-not-found");
    }
  }
  //logout admin
  async logout(req, res) {
    try {
      req.flash("message", "Logged out successfully.");
      res.clearCookie("adminToken");
      return res.redirect("/admin/login");
    } catch (error) {
      req.flash("error", `${error.message}`);
      return res.redirect("/admin/404-not-found");
    }
  }
  //update admin password view
  async updatePasswordAdminView(req, res) {
    try {
      const message = req.flash("message")[0];
      const error = req.flash("error")[0];
      return res.render("updatePassword", {
        user: req.user,
        message,
        error,
      });
    } catch (error) {
      req.flash("error", `${error.message}`);
      return res.redirect("/admin/404-not-found");
    }
  }
  //update password admin
  async updatePasswordAdmin(req, res) {
    try {
      const { id } = req.params;
      const { password, confirmPassword } = req.body;

      if (!password || !confirmPassword) {
        return req.flash(
          "error",
          "Both password and confirm password are required"
        );
      }

      if (password !== confirmPassword) {
        return req.flash("error", "Password and confirm password do not match");
      }

      // Find the user by ID
      const admindata = await Admin.findById(id);
      if (!admindata) {
        req.flash("error", `Admin not found.}`);
        return res.redirect("/admin/");
      }

      // Hash and update password
      const newPassword = await hashedPassword(password);
      const updateData = await Admin.findByIdAndUpdate(id, {
        $set: { password: newPassword },
      });
      if (updateData) {
        req.flash("message", "Password updated successfully.");
        return res.redirect("/admin/");
      }
    } catch (error) {
      req.flash("error", `${error.message}`);
    }
  }
  //admin forgot password view
  async forgotpasswordView(req, res) {
    try {
      const message = req.flash("message")[0];
      const error = req.flash("error")[0];
      res.render("forgotpassword", {
        message,
        error,
      });
    } catch (error) {
      req.flash("error", `Something went wrong,${error.message}`);
      return res.redirect("/admin/404-not-found");
    }
  }
  //reset password link
  async resetPasswordLink(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        req.flash("error", `Email is required.`);
        return res.redirect("/admin/forgot-password");
      }

      const admin = await Admin.findOne({ email });
      if (!admin) {
        req.flash("error", `Email doesnot exist.`);
        return res.redirect("/admin/forgot-password");
      }

      const secret = admin._id + process.env.JWT_SECRET_KEY;
      const token = jwt.sign({ adminId: admin._id }, secret, {
        expiresIn: "20m",
      });

      let resetLink;
      resetLink = `${process.env.ADMIN_HOST}/admin/account/reset-password/${admin._id}/${token}`;

      console.log("Reset Link:", resetLink);

      await transporter.sendMail({
        from: process.env.EMAIL_HOST,
        to: admin.email,
        subject: "Password Reset Link",
        html: `<h5>Hello, ${admin.name},</h5><h5>Please <a href="${resetLink}">Click here</a> to reset your password.</h5>`,
      });

      req.flash(
        "message",
        `Reset link has been sent to your email successfully.`
      );
      return res.redirect("/admin/login");
    } catch (error) {
      req.flash("error", `Something went wrong.${error.message}`);
      return res.redirect("/admin/404-not-found");
    }
  }

  //admin reset password view
  async resetPasswordView(req, res) {
    const { id, token } = req.params;
    const message = req.flash("message")[0];
    const error = req.flash("error")[0];

    try {
      const admin = await Admin.findById(id);
      if (!admin) {
        req.flash("error", `Admin not found`);
        return res.redirect("/admin/404-not-found");
      }

      const secret = admin._id + process.env.JWT_SECRET_KEY;
      jwt.verify(token, secret);

      // If the token is valid, render the form with the userId and token
      res.render("resetPassword", {
        message,
        error,
        adminId: id,
        token,
      });
    } catch (error) {
      req.flash("error", `Something went wrong,${error.message}`);
      return res.redirect("/admin/404-not-found");
    }
  }
  //reset password
  async resetPassword(req, res) {
    try {
      const { password, confirmPassword } = req.body;
      const { id, token } = req.params;

      const admin = await Admin.findById(id);
      if (!admin) {
        req.flash("error", "Admin not found.");
        return res.redirect("/admin/login");
      }

      // Validate token
      const newSecret = admin._id + process.env.JWT_SECRET_KEY;
      jwt.verify(token, newSecret);

      // Both fields are required
      if (!password || !confirmPassword) {
        req.flash("error", "All fields are required.");
        return res.redirect("/404-not-found");
      }

      if (password !== confirmPassword) {
        req.flash("error", "Password and Confirm Password doesnot match.");
        return res.redirect("/404-not-found");
      }

      // Generate salt and hash password
      const salt = await bcrypt.genSalt(10);
      const newHashPassword = await bcrypt.hash(password, salt);

      // Update password
      await Admin.findByIdAndUpdate(admin._id, {
        $set: { password: newHashPassword },
      });

      req.flash("message", "Password Reset Successful.");
      return res.redirect("/admin/login");
    } catch (error) {
      req.flash("error", `${error.message}`);
      return res.redirect("/admin/404-not-found");
    }
  }
  //not found
  async notfound(req, res) {
    try {
      const message = req.flash("message")[0];
      const error = req.flash("error")[0];
      res.render("404", {
        user: req.user,
        message,
        error,
      });
    } catch (error) {
      req.flash("error", `Something went wrong,${error.message}`);
      return res.redirect("/admin/404-not-found");
    }
  }
}
module.exports = new AdminController();
