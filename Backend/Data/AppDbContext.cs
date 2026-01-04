
using CourseHub.Models;
using Microsoft.EntityFrameworkCore;

namespace CourseHub.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        // =========================
        // DbSets (Tables)
        // =========================
        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Instructor> Instructors { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Lecture> Lectures { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Note> Notes { get; set; }
        public DbSet<Quiz> Quizzes { get; set; }
        public DbSet<QuizQuestion> QuizQuestions { get; set; }
        public DbSet<QuizOption> QuizOptions { get; set; }
        public DbSet<QuizResult> QuizResults { get; set; }
        public DbSet<ContactMessage> ContactMessages { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // =========================
            // Fluent API Configuration
            // =========================

            // User → Email Unique
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Instructor ↔ User (One-to-One)
            modelBuilder.Entity<Instructor>()
                .HasOne(i => i.User)
                .WithOne(u => u.Instructor)
                .HasForeignKey<Instructor>(i => i.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Course → Category (Many-to-One)
            modelBuilder.Entity<Course>()
                .HasOne(c => c.Category)
                .WithMany(cat => cat.Courses)
                .HasForeignKey(c => c.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            // Course → Instructor (Many-to-One)
            modelBuilder.Entity<Course>()
                .HasOne(c => c.Instructor)
                .WithMany(i => i.Courses)
                .HasForeignKey(c => c.InstructorId)
                .OnDelete(DeleteBehavior.Restrict);

            // Lecture → Course (Many-to-One)
            modelBuilder.Entity<Lecture>()
                .HasOne(l => l.Course)
                .WithMany(c => c.Lectures)
                .HasForeignKey(l => l.CourseId)
                .OnDelete(DeleteBehavior.Restrict);

            // Enrollment → User (Many-to-One)
            modelBuilder.Entity<Enrollment>()
                .HasOne(e => e.User)
                .WithMany(u => u.Enrollments)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Enrollment → Course (Many-to-One)
            modelBuilder.Entity<Enrollment>()
                .HasOne(e => e.Course)
                .WithMany(c => c.Enrollments)
                .HasForeignKey(e => e.CourseId)
                .OnDelete(DeleteBehavior.Restrict);

            // Review → User (Many-to-One)
            modelBuilder.Entity<Review>()
                .HasOne(r => r.User)
                .WithMany(u => u.Reviews)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Review → Course (Many-to-One)
            modelBuilder.Entity<Review>()
                .HasOne(r => r.Course)
                .WithMany(c => c.Reviews)
                .HasForeignKey(r => r.CourseId)
                .OnDelete(DeleteBehavior.Restrict);

            // Note → User (Many-to-One)
            modelBuilder.Entity<Note>()
                .HasOne(n => n.User)
                .WithMany()
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Note → Lecture (Many-to-One)
            modelBuilder.Entity<Note>()
                .HasOne(n => n.Lecture)
                .WithMany()
                .HasForeignKey(n => n.LectureId)
                .OnDelete(DeleteBehavior.Restrict);

            // Quiz → Course (Many-to-One)
            modelBuilder.Entity<Quiz>()
                .HasOne(q => q.Course)
                .WithMany()
                .HasForeignKey(q => q.CourseId)
                .OnDelete(DeleteBehavior.Restrict);

            // QuizQuestion → Quiz (Many-to-One)
            modelBuilder.Entity<QuizQuestion>()
                .HasOne(q => q.Quiz)
                .WithMany(qz => qz.Questions)
                .HasForeignKey(q => q.QuizId)
                .OnDelete(DeleteBehavior.Cascade);

            // QuizOption → QuizQuestion (Many-to-One)
            modelBuilder.Entity<QuizOption>()
                .HasOne(o => o.Question)
                .WithMany(q => q.Options)
                .HasForeignKey(o => o.QuestionId)
                .OnDelete(DeleteBehavior.Cascade);

            // QuizResult → Quiz (Many-to-One)
            modelBuilder.Entity<QuizResult>()
                .HasOne(r => r.Quiz)
                .WithMany()
                .HasForeignKey(r => r.QuizId)
                .OnDelete(DeleteBehavior.Restrict);

            // QuizResult → User (Many-to-One)
            modelBuilder.Entity<QuizResult>()
                .HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // =========================
            // Seed Data (Optional)
            // =========================
            SeedData(modelBuilder);
        }

        private static void SeedData(ModelBuilder modelBuilder)
        {
            var now = new DateTime(2025, 1, 1);

            // =========================
            // Users
            // =========================
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Name = "Amit Patel",
                    Email = "amit@gmail.com",
                    PasswordHash = "hash123",
                    Role = "Student",
                    CreatedAt = now,
                    ModifiedAt = now
                },
                new User
                {
                    Id = 2,
                    Name = "Riya Shah",
                    Email = "riya@gmail.com",
                    PasswordHash = "hash123",
                    Role = "Student",
                    CreatedAt = now,
                    ModifiedAt = now
                },
                new User
                {
                    Id = 3,
                    Name = "Neha Mehta",
                    Email = "neha@gmail.com",
                    PasswordHash = "hash123",
                    Role = "Instructor",
                    CreatedAt = now,
                    ModifiedAt = now
                }
            );

            // =========================
            // Categories
            // =========================
            modelBuilder.Entity<Category>().HasData(
                new Category
                {
                    CategoryId = 1,
                    CategoryName = "Programming",
                    CreatedAt = now,
                    ModifiedAt = now
                },
                new Category
                {
                    CategoryId = 2,
                    CategoryName = "Web Development",
                    CreatedAt = now,
                    ModifiedAt = now
                }
            );

            // =========================
            // Instructors
            // =========================
            modelBuilder.Entity<Instructor>().HasData(
                new Instructor
                {
                    InstructorId = 1,
                    UserId = 3, // Neha
                    Bio = "Expert in C# and .NET",
                    ExperienceYears = 5,
                    CreatedAt = now,
                    ModifiedAt = now
                }
            );

            // =========================
            // Courses
            // =========================
            modelBuilder.Entity<Course>().HasData(
                new Course
                {
                    Id = 1,
                    Title = "C# Basics",
                    Description = "Learn C# from scratch",
                    Price = 1999,
                    AverageRating = 4.5,
                    CategoryId = 1,
                    InstructorId = 1,
                    CreatedAt = now,
                    ModifiedAt = now
                },
                new Course
                {
                    Id = 2,
                    Title = "ASP.NET Core",
                    Description = "Build APIs with ASP.NET Core",
                    Price = 2999,
                    AverageRating = 4.7,
                    CategoryId = 2,
                    InstructorId = 1,
                    CreatedAt = now,
                    ModifiedAt = now
                }
            );

            // =========================
            // Lectures
            // =========================
            modelBuilder.Entity<Lecture>().HasData(
                new Lecture
                {
                    Id = 1,
                    CourseId = 1,
                    Title = "Introduction to C#",
                    VideoUrl = "https://video.com/csharp1",
                    ContentText = "C# Overview",
                    Order = 1,
                    IsPreview = true,
                    CreatedAt = now,
                    ModifiedAt = now
                },
                new Lecture
                {
                    Id = 2,
                    CourseId = 2,
                    Title = "ASP.NET Setup",
                    VideoUrl = "https://video.com/aspnet1",
                    ContentText = "Project setup",
                    Order = 1,
                    IsPreview = true,
                    CreatedAt = now,
                    ModifiedAt = now
                }
            );

            // =========================
            // Enrollments
            // =========================
            modelBuilder.Entity<Enrollment>().HasData(
                new Enrollment
                {
                    Id = 1,
                    UserId = 1, // Amit
                    CourseId = 1,
                    PaymentStatus = "Paid",
                    AmountPaid = 1999,
                    EnrolledAt = now,
                    ModifiedAt = now
                },
                new Enrollment
                {
                    Id = 2,
                    UserId = 2, // Riya
                    CourseId = 2,
                    PaymentStatus = "Pending",
                    AmountPaid = 0,
                    EnrolledAt = now,
                    ModifiedAt = now
                }
            );

            // =========================
            // Reviews
            // =========================
            modelBuilder.Entity<Review>().HasData(
                new Review
                {
                    Id = 1,
                    CourseId = 1,
                    UserId = 1,
                    Rating = 5,
                    Comment = "Excellent course",
                    CreatedAt = now,
                    ModifiedAt = now
                },
                new Review
                {
                    Id = 2,
                    CourseId = 2,
                    UserId = 2,
                    Rating = 4,
                    Comment = "Very informative",
                    CreatedAt = now,
                    ModifiedAt = now
                }
            );
            
            
           
        }

    }
}
