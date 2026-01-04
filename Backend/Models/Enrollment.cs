using CourseHub.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CourseHub.Models
{
    public class Enrollment
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }
        public int CourseId { get; set; }

        public DateTime EnrolledAt { get; set; }

        [Required, MaxLength(20)]
        public string PaymentStatus { get; set; } = string.Empty;

        [Column(TypeName = "decimal(10,2)")]
        public decimal AmountPaid { get; set; }

        public DateTime ModifiedAt { get; set; }

        // Navigation
        public User User { get; set; } = null!;
        public Course Course { get; set; } = null!;
    }

    public class EnrollmentDTO
    {
        public int UserId { get; set; }
        public int CourseId { get; set; }
        public string PaymentStatus { get; set; } = string.Empty;
        public decimal AmountPaid { get; set; }
    }
}
