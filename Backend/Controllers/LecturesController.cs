using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CourseHub.Models;
using System;
using CourseHub.Data;

namespace CourseHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LecturesController : ControllerBase
    {
        private readonly AppDbContext _db;

        public LecturesController(AppDbContext db)
        {
            _db = db;
        }

        // GET: api/lectures
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var lectures = await _db.Lectures.ToListAsync();
                return Ok(lectures);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting lectures", error = ex.Message });
            }
        }

        // GET: api/lectures/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var lecture = await _db.Lectures.FindAsync(id);
                if (lecture == null)
                    return NotFound(new { message = "Lecture not found" });

                return Ok(lecture);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting lecture", error = ex.Message });
            }
        }

        // GET: api/lectures/course/5
        [HttpGet("course/{courseId}")]
        public async Task<IActionResult> GetByCourse(int courseId)
        {
            try
            {
                var lectures = await _db.Lectures
                    .Where(l => l.CourseId == courseId)
                    .OrderBy(l => l.Order)
                    .ToListAsync();
                return Ok(lectures);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting course lectures", error = ex.Message });
            }
        }

        // POST: api/lectures
        [HttpPost]
        public async Task<IActionResult> Create(LectureDTO dto)
        {
            try
            {
                var lecture = new Lecture
                {
                    CourseId = dto.CourseId,
                    Title = dto.Title,
                    VideoUrl = dto.VideoUrl,
                    ContentText = dto.ContentText,
                    Order = dto.Order,
                    IsPreview = dto.IsPreview,
                    CreatedAt = DateTime.Now,
                    ModifiedAt = DateTime.Now
                };

                _db.Lectures.Add(lecture);
                await _db.SaveChangesAsync();

                return Created("", lecture);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating lecture", error = ex.Message });
            }
        }

        // PUT: api/lectures/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, LectureDTO dto)
        {
            try
            {
                var lecture = await _db.Lectures.FindAsync(id);
                if (lecture == null)
                    return NotFound(new { message = "Lecture not found" });

                lecture.Title = dto.Title;
                lecture.VideoUrl = dto.VideoUrl;
                lecture.ContentText = dto.ContentText;
                lecture.Order = dto.Order;
                lecture.IsPreview = dto.IsPreview;
                lecture.ModifiedAt = DateTime.Now;

                await _db.SaveChangesAsync();
                return Ok(lecture);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating lecture", error = ex.Message });
            }
        }

        // DELETE: api/lectures/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var lecture = await _db.Lectures.FindAsync(id);
                if (lecture == null)
                    return NotFound(new { message = "Lecture not found" });

                _db.Lectures.Remove(lecture);
                await _db.SaveChangesAsync();

                return Ok(new { message = "Lecture deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting lecture", error = ex.Message });
            }
        }
    }
}
