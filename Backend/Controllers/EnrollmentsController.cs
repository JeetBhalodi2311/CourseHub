using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CourseHub.Models;
using System;
using CourseHub.Data;

namespace CourseHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EnrollmentsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public EnrollmentsController(AppDbContext db)
        {
            _db = db;
        }

        // GET: api/enrollments
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var enrollments = await _db.Enrollments.ToListAsync();
                return Ok(enrollments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting enrollments", error = ex.Message });
            }
        }

        // GET: api/enrollments/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var enrollment = await _db.Enrollments.FindAsync(id);
                if (enrollment == null)
                    return NotFound(new { message = "Enrollment not found" });

                return Ok(enrollment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting enrollment", error = ex.Message });
            }
        }

        // POST: api/enrollments
        [HttpPost]
        public async Task<IActionResult> Create(EnrollmentDTO dto)
        {
            try
            {
                var enrollment = new Enrollment
                {
                    UserId = dto.UserId,
                    CourseId = dto.CourseId,
                    PaymentStatus = dto.PaymentStatus,
                    AmountPaid = dto.AmountPaid,
                    EnrolledAt = DateTime.Now,
                    ModifiedAt = DateTime.Now
                };

                _db.Enrollments.Add(enrollment);
                await _db.SaveChangesAsync();

                return Created("", enrollment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating enrollment", error = ex.Message });
            }
        }

        // PUT: api/enrollments/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, EnrollmentDTO dto)
        {
            try
            {
                var enrollment = await _db.Enrollments.FindAsync(id);
                if (enrollment == null)
                    return NotFound(new { message = "Enrollment not found" });

                enrollment.PaymentStatus = dto.PaymentStatus;
                enrollment.AmountPaid = dto.AmountPaid;
                enrollment.ModifiedAt = DateTime.Now;

                await _db.SaveChangesAsync();
                return Ok(enrollment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating enrollment", error = ex.Message });
            }
        }

        // GET: api/enrollments/user/5
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUserId(int userId)
        {
            try
            {
                var enrollments = await _db.Enrollments
                    .Include(e => e.Course) // Include Course details
                    .Where(e => e.UserId == userId)
                    .OrderByDescending(e => e.EnrolledAt)
                    .ToListAsync();
                return Ok(enrollments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting user enrollments", error = ex.Message });
            }
        }

        // GET: api/enrollments/instructor/5
        [HttpGet("instructor/{instructorId}")]
        public async Task<IActionResult> GetByInstructorId(int instructorId)
        {
            try
            {
                // Join Enrollments -> Course -> Check InstructorId
                var enrollments = await _db.Enrollments
                    .Include(e => e.Course)
                    .Include(e => e.User) // Include Student details
                    .Where(e => e.Course.InstructorId == instructorId)
                    .OrderByDescending(e => e.EnrolledAt)
                    .ToListAsync();

                return Ok(enrollments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting instructor enrollments", error = ex.Message });
            }
        }

        // DELETE: api/enrollments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var enrollment = await _db.Enrollments.FindAsync(id);
                if (enrollment == null)
                    return NotFound(new { message = "Enrollment not found" });

                _db.Enrollments.Remove(enrollment);
                await _db.SaveChangesAsync();

                return Ok(new { message = "Enrollment deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting enrollment", error = ex.Message });
            }
        }
    }
}
