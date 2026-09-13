using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CourseHub.Models;
using System;
using CourseHub.Data;
using Microsoft.AspNetCore.Authorization;

namespace CourseHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CoursesController : ControllerBase
    {
        private readonly AppDbContext _db;

        public CoursesController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var courses = await _db.Courses
                    .Include(c => c.Category)
                    .Include(c => c.Instructor)
                    .Include(c => c.Lectures)
                    .ToListAsync();

                return Ok(courses);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting courses", error = ex.Message });
            }
        }

        [HttpGet("instructor/{instructorId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetByInstructor(int instructorId)
        {
            try
            {
                var courses = await _db.Courses
                    .Include(c => c.Category)
                    .Include(c => c.Instructor)
                    .Include(c => c.Lectures)
                    .Where(c => c.InstructorId == instructorId)
                    .ToListAsync();

                return Ok(courses);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting instructor courses", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(int id)
        {
            var course = await _db.Courses
                .Include(c => c.Category)
                .Include(c => c.Instructor)
                .Include(c => c.Lectures)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (course == null)
                return NotFound(new { message = "Course not found" });

            return Ok(course);
        }

        [HttpPost]
        [Authorize(Roles = "Instructor,instructor,Admin,admin")]
        public async Task<IActionResult> Create(CourseDTO dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Validation: Check if Instructor exists
                var instructorExists = await _db.Instructors.AnyAsync(i => i.InstructorId == dto.InstructorId);
                if (!instructorExists)
                    return BadRequest(new { message = "Invalid Instructor ID. Please log out and log in again." });

                // Validation: Check if Category exists
                var categoryExists = await _db.Categories.AnyAsync(c => c.CategoryId == dto.CategoryId);
                if (!categoryExists)
                     return BadRequest(new { message = "Invalid Category ID." });

                var course = new Course
                {
                    Title = dto.Title,
                    Description = dto.Description,
                    Price = dto.Price,
                    ImageUrl = dto.ImageUrl,
                    CategoryId = dto.CategoryId,
                    InstructorId = dto.InstructorId,
                    CreatedAt = DateTime.Now,
                    ModifiedAt = DateTime.Now
                };

                _db.Courses.Add(course);
                await _db.SaveChangesAsync();

                return Created("", course);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating course", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Instructor,instructor,Admin,admin")]
        public async Task<IActionResult> Update(int id, CourseDTO dto)
        {
            try
            {
                var course = await _db.Courses.FindAsync(id);
                if (course == null)
                    return NotFound(new { message = "Course not found" });

                course.Title = dto.Title;
                course.Description = dto.Description;
                course.Price = dto.Price;
                course.ImageUrl = dto.ImageUrl; // Update Image
                course.CategoryId = dto.CategoryId;
                course.InstructorId = dto.InstructorId;
                course.ModifiedAt = DateTime.Now;

                await _db.SaveChangesAsync();
                return Ok(course);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating course", error = ex.Message });
            }
        }

        [HttpGet("{id}/stats")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCourseStats(int id)
        {
            try
            {
                var course = await _db.Courses
                    .Include(c => c.Lectures)
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (course == null)
                    return NotFound(new { message = "Course not found" });

                // Count enrollments for this course
                var enrollmentCount = await _db.Enrollments
                    .CountAsync(e => e.CourseId == id);

                // Count reviews for this course
                var reviewCount = await _db.Reviews
                    .CountAsync(r => r.CourseId == id);

                // Calculate total duration from lectures (assuming duration is in minutes)
                var totalDuration = course.Lectures?.Sum(l => l.Duration) ?? 0;

                return Ok(new
                {
                    enrollmentCount,
                    reviewCount,
                    totalDurationMinutes = totalDuration,
                    averageRating = course.AverageRating
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting course stats", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Instructor,instructor,Admin,admin")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var course = await _db.Courses.FindAsync(id);
                if (course == null)
                    return NotFound(new { message = "Course not found" });

                _db.Courses.Remove(course);
                await _db.SaveChangesAsync();

                return Ok(new { message = "Course deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting course", error = ex.Message });
            }
        }
    }
}
