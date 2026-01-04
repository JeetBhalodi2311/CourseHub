using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CourseHub.Data;
using CourseHub.Models;

namespace CourseHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NotesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Notes/{lectureId}/{userId}
        [HttpGet("{lectureId}/{userId}")]
        public async Task<ActionResult<Note>> GetNote(int lectureId, int userId)
        {
            var note = await _context.Notes
                .FirstOrDefaultAsync(n => n.LectureId == lectureId && n.UserId == userId);

            if (note == null)
            {
                return NotFound(new { message = "Note not found." });
            }

            return Ok(note);
        }

        // GET: api/Notes/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetUserNotes(int userId)
        {
            var notes = await _context.Notes
                .Include(n => n.Lecture)
                .ThenInclude(l => l.Course)
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.ModifiedAt)
                .Select(n => new
                {
                    n.Id,
                    n.Content,
                    n.ModifiedAt,
                    LectureId = n.LectureId,
                    LectureTitle = n.Lecture.Title,
                    CourseId = n.Lecture.CourseId,
                    CourseTitle = n.Lecture.Course.Title,
                    CourseThumbnail = n.Lecture.Course.ImageUrl
                })
                .ToListAsync();

            return Ok(notes);
        }

        // POST: api/Notes
        [HttpPost]
        public async Task<ActionResult<Note>> SaveNote(NoteDTO noteDto, [FromQuery] int userId)
        {
            if (userId <= 0)
            {
                 return BadRequest("Invalid User ID.");
            }

            var existingNote = await _context.Notes
                .FirstOrDefaultAsync(n => n.LectureId == noteDto.LectureId && n.UserId == userId);

            if (existingNote != null)
            {
                // Update
                existingNote.Content = noteDto.Content;
                existingNote.ModifiedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                return Ok(existingNote);
            }
            else
            {
                // Create
                var newNote = new Note
                {
                    UserId = userId,
                    LectureId = noteDto.LectureId,
                    Content = noteDto.Content,
                    CreatedAt = DateTime.UtcNow,
                    ModifiedAt = DateTime.UtcNow
                };

                _context.Notes.Add(newNote);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetNote), new { lectureId = newNote.LectureId, userId = newNote.UserId }, newNote);
            }
        }
    }
}
