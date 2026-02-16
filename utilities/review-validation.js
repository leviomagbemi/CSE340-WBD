const { body, validationResult } = require("express-validator")
const utilities = require(".")
const validate = {}

/* ***************************
 * Review validation rules
 * ************************** */
validate.reviewRules = () => {
  return [
    body("review_rating")
      .trim()
      .notEmpty()
      .isInt({ min: 1, max: 5 })
      .withMessage("Please select a rating between 1 and 5."),

    body("review_text")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 10 })
      .withMessage("Review must be at least 10 characters."),
  ]
}

/* ***************************
 * Check review data — attach errors to req, always call next()
 * ************************** */
validate.checkReviewData = async (req, res, next) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.reviewErrors = errors
  }
  next()
}

module.exports = validate
