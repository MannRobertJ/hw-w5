const { Router } = require("express");
const User = require("./model");
const bcrypt = require("bcrypt");

const router = new Router();

router.get("/users", (req, res, next) => {
  User.findAll()
    .then(users => {
      res.status(201).send({ users });
    })
    .catch(error => next(error));
});

router.post("/users", (req, res, next) => {
  if (
    !req.body.email ||
    !req.body.password ||
    !req.body.password_confirmation ||
    req.body.password !== req.body.password_confirmation
  ) {
    return res
      .status(400)
      .send("Please enter valid email and matching passwords");
  }
  User.create({ ...req.body, password: bcrypt.hashSync(req.body.password, 10) })
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: `User does not exist`
        });
      }
      return res.status(201).send(user);
    })
    .catch(error => next(error));
});

module.exports = router;
