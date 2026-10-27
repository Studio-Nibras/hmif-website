
const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../config/database");

const router = express.Router();

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password ||
      password.length > 128
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const [admins] = await pool.execute(
      `SELECT id, name, email, password_hash
       FROM admins
       WHERE email = ?
       LIMIT 1`,
      [email.trim().toLowerCase()]
    );

    const admin = admins[0];

    if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    req.session.regenerate((error) => {
      if (error) {
        return next(error);
      }

      req.session.admin = {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      };

      req.session.save((saveError) => {
        if (saveError) {
          return next(saveError);
        }

        res.json({
          success: true,
          message: "Login successful",
          admin: req.session.admin,
        });
      });
    });
  } catch (error) {
    next(error);
  }
});

router.get("/me", (req, res) => {
  if (!req.session?.admin) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }

  res.json({
    success: true,
    admin: req.session.admin,
  });
});

router.post("/logout", (req, res, next) => {
  if (!req.session) {
    res.clearCookie("hmif.sid");
    return res.json({
      success: true,
      message: "Logout successful",
    });
  }

  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }

    res.clearCookie("hmif.sid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    res.json({
      success: true,
      message: "Logout successful",
    });
  });
});

module.exports = router;
