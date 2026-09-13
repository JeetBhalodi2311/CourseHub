using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CourseHub.Models
{
    public class Quiz
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int CourseId { get; set; }

        [Required, MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Range(1, int.MaxValue)]
        public int Order { get; set; }

        [Range(0, 100)]
        public int PassingScore { get; set; } = 70; // Default 70%

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime ModifiedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        [JsonIgnore]
        public Course Course { get; set; } = null!;

        public ICollection<QuizQuestion> Questions { get; set; } = new List<QuizQuestion>();
    }

    public class QuizDTO
    {
        public int CourseId { get; set; }
        public string Title { get; set; } = string.Empty;
        public int Order { get; set; }
        public int PassingScore { get; set; }
        public List<QuizQuestionDTO> Questions { get; set; } = new List<QuizQuestionDTO>();
    }
}
