using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CourseHub.Models
{
    public class QuizQuestion
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int QuizId { get; set; }

        [Required]
        public string Text { get; set; } = string.Empty;

        // Navigation
        [JsonIgnore]
        public Quiz Quiz { get; set; } = null!;

        public ICollection<QuizOption> Options { get; set; } = new List<QuizOption>();
    }

    public class QuizQuestionDTO
    {
        public string Text { get; set; } = string.Empty;
        public List<QuizOptionDTO> Options { get; set; } = new List<QuizOptionDTO>();
    }
}
