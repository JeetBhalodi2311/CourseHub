using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CourseHub.Models
{
    public class Note
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }
        public int LectureId { get; set; }

        public string Content { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }

        // Navigation
        [JsonIgnore]
        public User User { get; set; } = null!;
        [JsonIgnore]
        public Lecture Lecture { get; set; } = null!;
    }
    
    public class NoteDTO
    {
        public int LectureId { get; set; }
        public string Content { get; set; } = string.Empty;
    }
}
