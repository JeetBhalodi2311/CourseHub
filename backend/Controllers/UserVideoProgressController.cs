using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using CourseHub.Data;
using CourseHub.Models;

namespace CourseHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Student,Instructor,Admin")]
    public class UserVideoProgressController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserVideoProgressController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/UserVideoProgress/{lectureId}/{userId}
        [HttpGet("{lectureId}/{userId}")]
        public async Task<ActionResult<UserVideoProgress>> GetProgress(int lectureId, int userId)
        {
            var progress = await _context.VideoProgress
                .FirstOrDefaultAsync(p => p.LectureId == lectureId && p.UserId == userId);

            if (progress == null)
            {
                return NotFound(new { message = "Progress not found." });
            }

            return Ok(progress);
        }

        // POST: api/UserVideoProgress
        [HttpPost]
        public async Task<ActionResult<UserVideoProgress>> SaveProgress(UserVideoProgressDTO dto, [FromQuery] int userId)
        {
            if (userId <= 0)
            {
                return BadRequest("Invalid User ID.");
            }

            var existingProgress = await _context.VideoProgress
                .FirstOrDefaultAsync(p => p.LectureId == dto.LectureId && p.UserId == userId);

            if (existingProgress != null)
            {
                // Update
                existingProgress.WatchedPosition = dto.WatchedPosition;
                existingProgress.LastAccessed = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                return Ok(existingProgress);
            }
            else
            {
                // Create
                var newProgress = new UserVideoProgress
                {
                    UserId = userId,
                    LectureId = dto.LectureId,
                    WatchedPosition = dto.WatchedPosition,
                    LastAccessed = DateTime.UtcNow
                };

                _context.VideoProgress.Add(newProgress);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetProgress), new { lectureId = newProgress.LectureId, userId = newProgress.UserId }, newProgress);
            }
        }
    }
}
