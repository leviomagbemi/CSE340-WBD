const express = require("express")
const router = new express.Router()
const reviewController = require("../controllers/reviewController")
const utilities = require("../utilities")
const reviewValidate = require("../utilities/review-validation")

// GET: View all reviews the logged-in user has written
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.buildAccountReviews)
)

// POST: Submit a new review
router.post(
  "/add",
  utilities.checkLogin,
  reviewValidate.reviewRules(),
  reviewValidate.checkReviewData,
  utilities.handleErrors(reviewController.addReview)
)

// POST: Delete a review
router.post(
  "/delete",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.deleteReview)
)

module.exports = router
