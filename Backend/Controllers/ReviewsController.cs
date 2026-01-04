using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CourseHub.Models;
using System;
using CourseHub.Data;

namespace CourseHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ReviewsController(AppDbContext db)
        {
            _db = db;
        }

        // GET: api/reviews
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var reviews = await _db.Reviews
                    .Include(r => r.Course)
                    .Include(r => r.User)
                    .ToListAsync();
                return Ok(reviews);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting reviews", error = ex.Message });
            }
        }

        // GET: api/reviews/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var review = await _db.Reviews.FindAsync(id);
                if (review == null)
                    return NotFound(new { message = "Review not found" });

                return Ok(review);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting review", error = ex.Message });
            }
        }

        // POST: api/reviews
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ReviewDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var review = new Review
            {
                CourseId = dto.CourseId,
                UserId = dto.UserId,
                Rating = dto.Rating,
                Comment = dto.Comment,
                CreatedAt = DateTime.Now,
                ModifiedAt = DateTime.Now
            };

            _db.Reviews.Add(review);
            await _db.SaveChangesAsync();

            return Created("", review);
        }


        // PUT: api/reviews/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ReviewDTO dto)
        {
            try
            {
                var review = await _db.Reviews.FindAsync(id);
                if (review == null)
                    return NotFound(new { message = "Review not found" });

                review.Rating = dto.Rating;
                review.Comment = dto.Comment;
                review.ModifiedAt = DateTime.Now;

                await _db.SaveChangesAsync();
                return Ok(review);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating review", error = ex.Message });
            }
        }

        // DELETE: api/reviews/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var review = await _db.Reviews.FindAsync(id);
                if (review == null)
                    return NotFound(new { message = "Review not found" });

                _db.Reviews.Remove(review);
                await _db.SaveChangesAsync();

                return Ok(new { message = "Review deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting review", error = ex.Message });
            }
        }
    }
}
