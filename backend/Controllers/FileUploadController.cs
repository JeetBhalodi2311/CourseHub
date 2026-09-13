using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading.Tasks;

namespace CourseHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileUploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;
        private const long MaxFileSize = 5 * 1024 * 1024; // 5MB
        private readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".svg" };

        public FileUploadController(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        [HttpPost("course-image")]
        public async Task<IActionResult> UploadCourseImage(IFormFile file)
        {
            try
            {
                // Validate file exists
                if (file == null || file.Length == 0)
                    return BadRequest(new { message = "No file uploaded" });

                // Validate file size
                if (file.Length > MaxFileSize)
                    return BadRequest(new { message = "File size exceeds 5MB limit" });

                // Validate file extension
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (!Array.Exists(AllowedExtensions, ext => ext == extension))
                    return BadRequest(new { message = "Invalid file type. Allowed: JPG, JPEG, PNG, WEBP, GIF, BMP, SVG" });

                // Get web root path, fallback to current directory/wwwroot if null
                var webRootPath = _environment.WebRootPath;
                if (string.IsNullOrEmpty(webRootPath))
                {
                    webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                }

                // Create uploads directory if it doesn't exist
                var uploadsPath = Path.Combine(webRootPath, "uploads", "courses");
                if (!Directory.Exists(uploadsPath))
                {
                    Directory.CreateDirectory(uploadsPath);
                }

                // Generate unique filename
                var fileName = $"{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(uploadsPath, fileName);

                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Return URL path
                var fileUrl = $"/uploads/courses/{fileName}";
                return Ok(new { url = fileUrl, fileName = fileName });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error uploading file", error = ex.Message });
            }
        }

        [HttpDelete("course-image/{fileName}")]
        public IActionResult DeleteCourseImage(string fileName)
        {
            try
            {
                var filePath = Path.Combine(_environment.WebRootPath, "uploads", "courses", fileName);
                
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                    return Ok(new { message = "File deleted successfully" });
                }

                return NotFound(new { message = "File not found" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting file", error = ex.Message });
            }
        }
    }
}
