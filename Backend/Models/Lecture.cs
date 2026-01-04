using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CourseHub.Models
{
    public class Lecture
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int CourseId { get; set; }

        [Required, MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? VideoUrl { get; set; }

        public string? ContentText { get; set; }

        [Range(1, int.MaxValue)]
        public int Order { get; set; }

        public bool IsPreview { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }

        // Navigation
        [JsonIgnore]
        public Course Course { get; set; } = null!;
    }

    public class LectureDTO
    {
        public int CourseId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? VideoUrl { get; set; }
        public string? ContentText { get; set; }
        public int Order { get; set; }
        public bool IsPreview { get; set; }
    }
}
