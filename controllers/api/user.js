const router = require('express').Router();
const { User } = require('../../models');

router.route('/').post(async (req, res) => {
  try {
    if (
      !req.body.hasOwnProperty('username') ||
      !req.body.hasOwnProperty('email') ||
      !req.body.hasOwnProperty('password')
    ) {
      res.status(404).json(new Error('Not all fields provided.'));
    }
    const newUser = await User.create(req.body);
    res.status(200).json(newUser);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router
  .route('/:id')
  .put(async ({ body: { username, password, email }, params }, res) => {
    // Change password, update username
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: params.id },
        { username, password, email },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
  });

module.exports = router;
