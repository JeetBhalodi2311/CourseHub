using CourseHub.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CourseHub.Models
{
    public class Instructor
    {
        [Key]
        public int InstructorId { get; set; }

        [Required]
        public int UserId { get; set; }

        [MaxLength(500)]
        public string? Bio { get; set; }

        [Range(0, int.MaxValue)]
        public int ExperienceYears { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }

        // Navigation
        [JsonIgnore]
        [ForeignKey(nameof(UserId))]
        public User User { get; set; } = null!;

        [JsonIgnore]
        public ICollection<Course> Courses { get; set; } = new List<Course>();
    }

    public class InstructorDTO
    {
        [Required]
        public int UserId { get; set; }

        public string? Bio { get; set; }

        public int ExperienceYears { get; set; }
    }
}
