const { authenticateAdmin } = require("./auth.service");

async function login(req, res, next) {
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

    const admin = await authenticateAdmin(email, password);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    req.session.regenerate((error) => {
      if (error) {
        return next(error);
      }

      req.session.admin = admin;

      req.session.save((saveError) => {
        if (saveError) {
          return next(saveError);
        }

        return res.json({
          success: true,
          message: "Login successful",
          admin: req.session.admin,
        });
      });
    });
  } catch (error) {
    next(error);
  }
}

function getCurrentAdmin(req, res) {
  if (!req.session?.admin) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }

  return res.json({
    success: true,
    admin: req.session.admin,
  });
}

function logout(req, res, next) {
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

    return res.json({
      success: true,
      message: "Logout successful",
    });
  });
}

module.exports = {
  login,
  getCurrentAdmin,
  logout,
};
