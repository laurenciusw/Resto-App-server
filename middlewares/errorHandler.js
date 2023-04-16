module.exports = (error, req, res, next) => {
  let message = "Internal Server Error";
  let status = 500;

  switch (error.name) {
    case "categoryRequired":
      status = 400;
      message = "Input the category";
      break;
    case "PasswordRequired":
      status = 400;
      message = "password is required";
      break;
    case "EmailRequired":
      status = 400;
      message = "email is required";
      break;
    case "SequelizeValidationError":
    case "SequelizeUniqueConstraintError":
      status = 400;
      message = error.errors[0].message;
      break;
    case "InvalidCredentials":
      status = 401;
      message = "Unauthenticated";
      break;
    case "invalidToken":
    case "JsonWebTokenError":
      status = 401;
      message = "invalid token";
      break;
    case "Forbidden":
      status = 403;
      message = "You are not authorized";
      break;

    case "NotFound":
      status = 404;
      message = "Data not Found";
      break;
    default:
      break;
  }

  res.status(status).json({ message: message });
};
