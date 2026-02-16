const pool = require("../database/")

/* ***************************
 * Add a new review
 * ************************** */
async function addReview(review_text, review_rating, inv_id, account_id) {
  try {
    const sql = `INSERT INTO public.review
      (review_text, review_rating, inv_id, account_id)
      VALUES ($1, $2, $3, $4) RETURNING *`
    return await pool.query(sql, [review_text, review_rating, inv_id, account_id])
  } catch (error) {
    return error.message
  }
}

/* ***************************
 * Get all reviews for a vehicle
 * ************************** */
async function getReviewsByInvId(inv_id) {
  try {
    const sql = `
      SELECT r.*, a.account_firstname, a.account_lastname
      FROM public.review r
      JOIN public.account a ON r.account_id = a.account_id
      WHERE r.inv_id = $1
      ORDER BY r.review_date DESC`
    const result = await pool.query(sql, [inv_id])
    return result.rows
  } catch (error) {
    console.error("getReviewsByInvId error: " + error)
  }
}

/* ***************************
 * Get all reviews written by an account
 * ************************** */
async function getReviewsByAccountId(account_id) {
  try {
    const sql = `
      SELECT r.*, i.inv_make, i.inv_model, i.inv_year
      FROM public.review r
      JOIN public.inventory i ON r.inv_id = i.inv_id
      WHERE r.account_id = $1
      ORDER BY r.review_date DESC`
    const result = await pool.query(sql, [account_id])
    return result.rows
  } catch (error) {
    console.error("getReviewsByAccountId error: " + error)
  }
}

/* ***************************
 * Delete a review (owner only)
 * ************************** */
async function deleteReview(review_id, account_id) {
  try {
    const sql = `DELETE FROM public.review
      WHERE review_id = $1 AND account_id = $2 RETURNING *`
    const result = await pool.query(sql, [review_id, account_id])
    return result.rows[0]
  } catch (error) {
    return error.message
  }
}

module.exports = { addReview, getReviewsByInvId, getReviewsByAccountId, deleteReview }
