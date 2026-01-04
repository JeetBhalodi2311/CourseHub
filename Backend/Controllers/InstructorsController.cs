using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CourseHub.Models;
using System;
using CourseHub.Data;

namespace CourseHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InstructorsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public InstructorsController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var instructors = await _db.Instructors.Include(i => i.User).ToListAsync();
                return Ok(instructors);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting instructors", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var instructor = await _db.Instructors
                .Include(i => i.User)
                .FirstOrDefaultAsync(i => i.InstructorId == id);

            if (instructor == null)
                return NotFound(new { message = "Instructor not found" });

            return Ok(instructor);
        }

        [HttpPost]
        public async Task<IActionResult> Create(InstructorDTO dto)
        {
            try
            {
                var instructor = new Instructor
                {
                    UserId = dto.UserId,
                    Bio = dto.Bio,
                    ExperienceYears = dto.ExperienceYears,
                    CreatedAt = DateTime.Now,
                    ModifiedAt = DateTime.Now
                };

                _db.Instructors.Add(instructor);
                await _db.SaveChangesAsync();

                return Created("", instructor);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating instructor", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, InstructorDTO dto)
        {
            try
            {
                var instructor = await _db.Instructors.FindAsync(id);
                if (instructor == null)
                    return NotFound(new { message = "Instructor not found" });

                instructor.Bio = dto.Bio;
                instructor.ExperienceYears = dto.ExperienceYears;
                instructor.ModifiedAt = DateTime.Now;

                await _db.SaveChangesAsync();
                return Ok(instructor);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating instructor", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var instructor = await _db.Instructors.FindAsync(id);
                if (instructor == null)
                    return NotFound(new { message = "Instructor not found" });

                _db.Instructors.Remove(instructor);
                await _db.SaveChangesAsync();

                return Ok(new { message = "Instructor deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting instructor", error = ex.Message });
            }
        }
    }
}
