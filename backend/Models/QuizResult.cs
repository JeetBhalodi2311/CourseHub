using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CourseHub.Models
{
    public class QuizResult
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int QuizId { get; set; }

        [Required]
        public int UserId { get; set; }

        public int Score { get; set; } // Percentage

        public bool Passed { get; set; }

        public DateTime AttemptedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        [JsonIgnore]
        public Quiz Quiz { get; set; } = null!;
        
        [JsonIgnore]
        public User User { get; set; } = null!;
    }
}
