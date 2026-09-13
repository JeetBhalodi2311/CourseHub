using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CourseHub.Models
{
    public class Category
    {
        [Key]
        public int CategoryId { get; set; }

        [Required, MaxLength(100)]
        public string CategoryName { get; set; } = string.Empty;

        public string? ImageUrl { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }

        [JsonIgnore]
        public ICollection<Course> Courses { get; set; } = new List<Course>();
    }

    public class CategoryDTO
    {
        [Required, MaxLength(100)]
        public string CategoryName { get; set; } = string.Empty;

        public string? ImageUrl { get; set; }
    }
}
