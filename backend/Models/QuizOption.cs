using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CourseHub.Models
{
    public class QuizOption
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int QuestionId { get; set; }

        [Required]
        public string Text { get; set; } = string.Empty;

        public bool IsCorrect { get; set; }

        // Navigation
        [JsonIgnore]
        public QuizQuestion Question { get; set; } = null!;
    }

    public class QuizOptionDTO
    {
        public string Text { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }
    }
}
