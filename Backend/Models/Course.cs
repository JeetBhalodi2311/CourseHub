using CourseHub.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CourseHub.Models
{
    public class Course
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }

        [Range(0, 5)]
        public double? AverageRating { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }

        // Foreign Keys
        public int CategoryId { get; set; }
        public int InstructorId { get; set; }
        
        public string? ImageUrl { get; set; } // Added for thumbnail

        // Navigation
        public Category Category { get; set; } = null!;
        public Instructor Instructor { get; set; } = null!;

        public ICollection<Lecture> Lectures { get; set; } = new List<Lecture>();

        [JsonIgnore]
        public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();

        [JsonIgnore]
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }

    public class CourseDTO
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public decimal Price { get; set; }

        public string? ImageUrl { get; set; } // Added for thumbnail

        public int CategoryId { get; set; }

        public int InstructorId { get; set; }
    }
}
