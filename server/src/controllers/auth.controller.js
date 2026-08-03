exports.register = async (req, res) => {
  res.json({
    message: "Controller REGISTER funcționează!",
    data: req.body,
  });
};