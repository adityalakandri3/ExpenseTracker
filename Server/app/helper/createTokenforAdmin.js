
const jwt = require("jsonwebtoken");

const createToken = async (id) => {
  try {
    const token = jwt.sign({ user: id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    console.log('Formcreate token',token)
    return token;
  } catch (error) {
    // res.status(400).send(error.message);
    console.log(error);
  }
};

module.exports = createToken;