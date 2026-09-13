using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CourseHub.Models
{
    public class UserVideoProgress
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public int LectureId { get; set; }

        // Watched position in seconds
        [Required]
        public double WatchedPosition { get; set; }

        public DateTime LastAccessed { get; set; } = DateTime.UtcNow;

        // Navigation
        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

        [ForeignKey("LectureId")]
        public Lecture Lecture { get; set; } = null!;
    }

    public class UserVideoProgressDTO
    {
        public int LectureId { get; set; }
        public double WatchedPosition { get; set; }
    }
}
