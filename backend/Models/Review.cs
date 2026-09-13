using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CourseHub.Models
{
    public class Review
    {
        [Key]
        public int Id { get; set; }

        public int CourseId { get; set; }
        public int UserId { get; set; }

        [Range(1, 5)]
        public int Rating { get; set; }

        public string? Comment { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }

        public Course Course { get; set; } = null!;

        public User User { get; set; } = null!;
    }

    public class ReviewDTO
    {
        public int CourseId { get; set; }
        public int UserId { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
    }
}
