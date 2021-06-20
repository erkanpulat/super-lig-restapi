const errorCatcher = (err, req, res, next) => {
  if (err.code === 11000) {
    return res.status(err.statusCode || 400)  .json({
      statusCode: err.statusCode || 400,
      message:
        Object.keys(err.keyValue) +
        ": " +
        Object.values(err.keyValue) +
        " already registered",
    });
  } else {
    return res.status(err.statusCode || 500).json({
      statusCode: err.statusCode || 500,
      message: err.message,
    });
  }
};

module.exports = errorCatcher;
