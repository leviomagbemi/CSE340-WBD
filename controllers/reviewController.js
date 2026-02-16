const reviewModel = require("../models/review-model")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const reviewCont = {}

/* ***************************
 * Submit a new review
 * ************************** */
reviewCont.addReview = async function (req, res, next) {
  const { review_text, review_rating, inv_id } = req.body
  const account_id = res.locals.accountData.account_id

  // If server-side validation failed, re-render detail view with errors
  if (req.reviewErrors && !req.reviewErrors.isEmpty()) {
    const vehicle = await invModel.getInventoryById(inv_id)
    if (!vehicle) {
      const error = new Error("Vehicle not found")
      error.status = 404
      return next(error)
    }
    const vehicleHtml = await utilities.buildVehicleDetailHTML(vehicle)
    const reviews = await reviewModel.getReviewsByInvId(inv_id)
    let nav = await utilities.getNav()
    return res.status(400).render("./inventory/detail", {
      title: `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicleHtml,
      reviews,
      errors: req.reviewErrors,
      review_text,
      review_rating,
      inv_id,
    })
  }

  const result = await reviewModel.addReview(review_text, review_rating, inv_id, account_id)
  if (result) {
    req.flash("success", "Your review was submitted successfully.")
  } else {
    req.flash("notice", "Sorry, the review could not be saved. Please try again.")
  }
  res.redirect(`/inv/detail/${inv_id}`)
}

/* ***************************
 * Build account reviews management view
 * ************************** */
reviewCont.buildAccountReviews = async function (req, res, next) {
  const account_id = res.locals.accountData.account_id
  const reviews = await reviewModel.getReviewsByAccountId(account_id)
  let nav = await utilities.getNav()
  res.render("account/reviews", {
    title: "My Reviews",
    nav,
    reviews,
    errors: null,
  })
}

/* ***************************
 * Delete a review
 * ************************** */
reviewCont.deleteReview = async function (req, res, next) {
  const review_id = parseInt(req.body.review_id)
  const account_id = res.locals.accountData.account_id

  const result = await reviewModel.deleteReview(review_id, account_id)
  if (result) {
    req.flash("success", "Review deleted successfully.")
  } else {
    req.flash("notice", "Sorry, the review could not be deleted.")
  }
  res.redirect("/account/reviews")
}

module.exports = reviewCont
