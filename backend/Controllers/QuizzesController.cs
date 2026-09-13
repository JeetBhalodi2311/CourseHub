using CourseHub.Data;
using CourseHub.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace CourseHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class QuizzesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public QuizzesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Quizzes/course/{courseId}
        [HttpGet("course/{courseId}")]
        [Authorize(Roles = "Student,student,Instructor,instructor,Admin,admin")]
        public async Task<ActionResult<IEnumerable<Quiz>>> GetQuizzesByCourse(int courseId)
        {
            return await _context.Quizzes
                .Where(q => q.CourseId == courseId)
                .OrderBy(q => q.Order)
                .ToListAsync();
        }

        // GET: api/Quizzes/{id}
        [HttpGet("{id}")]
        [Authorize(Roles = "Student,student,Instructor,instructor,Admin,admin")]
        public async Task<ActionResult<Quiz>> GetQuiz(int id)
        {
            var quiz = await _context.Quizzes
                .Include(q => q.Questions)
                .ThenInclude(qp => qp.Options)
                .FirstOrDefaultAsync(q => q.Id == id);

            if (quiz == null)
            {
                return NotFound();
            }

            return quiz;
        }

        // POST: api/Quizzes
        [HttpPost]
        [Authorize(Roles = "Instructor,instructor,Admin,admin")]
        public async Task<ActionResult<Quiz>> CreateQuiz(QuizDTO quizDto)
        {
            var quiz = new Quiz
            {
                CourseId = quizDto.CourseId,
                Title = quizDto.Title,
                Order = quizDto.Order,
                PassingScore = quizDto.PassingScore,
                Questions = quizDto.Questions.Select(q => new QuizQuestion
                {
                    Text = q.Text,
                    Options = q.Options.Select(o => new QuizOption
                    {
                        Text = o.Text,
                        IsCorrect = o.IsCorrect
                    }).ToList()
                }).ToList()
            };

            _context.Quizzes.Add(quiz);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetQuiz), new { id = quiz.Id }, quiz);
        }

        // POST: api/Quizzes/{id}/submit
        [HttpPost("{id}/submit")]
        [Authorize(Roles = "Student,student,Instructor,instructor,Admin,admin")]
        public async Task<ActionResult<QuizResult>> SubmitQuiz(int id, [FromBody] QuizSubmissionDTO submission, [FromQuery] int userId)
        {
            var quiz = await _context.Quizzes
                .Include(q => q.Questions)
                .ThenInclude(qp => qp.Options)
                .FirstOrDefaultAsync(q => q.Id == id);

            if (quiz == null)
            {
                return NotFound();
            }

            int correctCount = 0;
            foreach (var answer in submission.Answers)
            {
                var question = quiz.Questions.FirstOrDefault(q => q.Id == answer.QuestionId);
                if (question != null)
                {
                    var selectedOption = question.Options.FirstOrDefault(o => o.Id == answer.SelectedOptionId);
                    if (selectedOption != null && selectedOption.IsCorrect)
                    {
                        correctCount++;
                    }
                }
            }

            int totalQuestions = quiz.Questions.Count;
            int score = totalQuestions > 0 ? (int)((double)correctCount / totalQuestions * 100) : 0;
            bool passed = score >= quiz.PassingScore;

            var result = new QuizResult
            {
                QuizId = id,
                UserId = userId,
                Score = score,
                Passed = passed
            };

            _context.QuizResults.Add(result);
            await _context.SaveChangesAsync();

            return Ok(result);
        }

        // DELETE: api/Quizzes/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Instructor,instructor,Admin,admin")]
        public async Task<IActionResult> DeleteQuiz(int id)
        {
            var quiz = await _context.Quizzes.FindAsync(id);
            if (quiz == null)
            {
                return NotFound();
            }

            _context.Quizzes.Remove(quiz);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public class QuizSubmissionDTO
    {
        public List<QuizAnswerDTO> Answers { get; set; } = new List<QuizAnswerDTO>();
    }

    public class QuizAnswerDTO
    {
        public int QuestionId { get; set; }
        public int SelectedOptionId { get; set; }
    }
}
