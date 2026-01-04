using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CourseHub.Models
{
    
        public class User
        {
            [Key]
            public int Id { get; set; }

            [Required, MaxLength(100)]
            public string Name { get; set; } = string.Empty;

            [Required, MaxLength(150)]
            public string Email { get; set; } = string.Empty;

            [Required, MaxLength(255)]
            public string PasswordHash { get; set; } = string.Empty;

        [Required, MaxLength(20)]
            public string Role { get; set; } = string.Empty; // Student / Instructor

            public DateTime CreatedAt { get; set; }
            public DateTime ModifiedAt { get; set; }

        //Navigation
        public Instructor? Instructor { get; set; }

        [JsonIgnore]
        public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();

        [JsonIgnore]
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        }

        public class UserDTO
        {
            [Required, MaxLength(100)]
            public string Name { get; set; } = string.Empty;

            [Required, MaxLength(150)]
            public string Email { get; set; } = string.Empty;

            [Required, MaxLength(255)]
            public string PasswordHash { get; set; } = string.Empty;

            [Required]
            public string Role { get; set; } = string.Empty;
        }
    }
