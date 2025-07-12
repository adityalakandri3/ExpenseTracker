const AdminAuthCheck = require("./AdminAuthCheck");
const  {AuthCheck}  = require("./Auth");


const CombinedAuth = async (req, res, next) => {
  let calledNext = false;

  const wrappedNext = (err) => {
    if (!calledNext && !err) {
      calledNext = true;
      return next();
    }
  };
  await AdminAuthCheck(req, res, wrappedNext);

  if (calledNext) return;

  await AuthCheck(req, res, wrappedNext);

  if (calledNext) return;

  if (!calledNext) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: neither admin nor user.",
    });
  }
};

module.exports = CombinedAuth;
