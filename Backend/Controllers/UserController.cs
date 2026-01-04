using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CourseHub.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations;
using CourseHub.Data;

namespace CourseHub.Controllers
{
        [ApiController]
        [Route("api/[controller]")]
        public class UsersController : ControllerBase
        {
            private readonly AppDbContext _db;
            public UsersController(AppDbContext db)
            {
                _db = db;
            }

            // GET: api/users
            [HttpGet]
            public async Task<IActionResult> GetAll()
            {
                try
                {
                    var users = await _db.Users.ToListAsync();
                    return Ok(users);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "Error getting users", error = ex.Message });
                }
            }

            // GET: api/users/5
            [HttpGet("{id}")]
            public async Task<IActionResult> GetById(int id)
            {
                try
                {
                    var user = await _db.Users.FindAsync(id);
                    if (user == null)
                        return NotFound(new { message = "User not found" });

                    return Ok(user);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "Error getting user", error = ex.Message });
                }
            }

            // POST: api/users
            [HttpPost]
            public async Task<IActionResult> Create(UserDTO user)
            {
                try
                {
                    if (!ModelState.IsValid)
                        return BadRequest(ModelState);

                    bool emailExists = await _db.Users.AnyAsync(u => u.Email == user.Email);
                    if (emailExists)
                        return BadRequest(new { message = "Email already exists" });

                    var userToAdd = new User
                    {
                        Name = user.Name,
                        Email = user.Email,
                        PasswordHash = user.PasswordHash,
                        Role = user.Role,
                        CreatedAt = DateTime.Now,
                        ModifiedAt = DateTime.Now
                    };

                    _db.Users.Add(userToAdd);
                    await _db.SaveChangesAsync();

                    // If the user role is Instructor, add to the Instructors table
                    if (string.Equals(user.Role, "Instructor", StringComparison.OrdinalIgnoreCase))
                    {
                        var instructor = new Instructor
                        {
                            UserId = userToAdd.Id,
                            Bio = "",
                            ExperienceYears = 0,
                            CreatedAt = DateTime.Now,
                            ModifiedAt = DateTime.Now
                        };
                        _db.Instructors.Add(instructor);
                        await _db.SaveChangesAsync();
                        
                        // Manually attach instructor to user object so it's returned in response
                        userToAdd.Instructor = instructor; 
                    }

                    return Created("", userToAdd);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "Error creating user", error = ex.Message });
                }
            }

            // ... (Update/Delete omitted for brevity if not changing) ...

            // POST: api/users/login
            [HttpPost("login")]
            public async Task<IActionResult> Login([FromBody] LoginDTO loginDto)
            {
                try
                {
                    if (!ModelState.IsValid)
                        return BadRequest(ModelState);

                    var user = await _db.Users
                        .Include(u => u.Instructor) // Include Instructor details
                        .FirstOrDefaultAsync(u => u.Email == loginDto.Email && u.PasswordHash == loginDto.Password);

                    if (user == null)
                        return Unauthorized(new { message = "Invalid email or password" });

                    return Ok(user);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "Error logging in", error = ex.Message });
                }
            }

            // PUT: api/users/5
            [HttpPut("{id}")]
            public async Task<IActionResult> Update(int id, [FromBody] UpdateUserDTO dto)
            {
                try
                {
                    var user = await _db.Users.FindAsync(id);
                    if (user == null)
                        return NotFound(new { message = "User not found" });

                    user.Name = dto.Name ?? user.Name;
                    user.Email = dto.Email ?? user.Email;
                    user.ModifiedAt = DateTime.Now;

                    await _db.SaveChangesAsync();
                    return Ok(user);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "Error updating user", error = ex.Message });
                }
            }

            // POST: api/users/5/change-password
            [HttpPost("{id}/change-password")]
            public async Task<IActionResult> ChangePassword(int id, [FromBody] ChangePasswordDTO dto)
            {
                try
                {
                    var user = await _db.Users.FindAsync(id);
                    if (user == null)
                        return NotFound(new { message = "User not found" });

                    if (user.PasswordHash != dto.CurrentPassword)
                        return BadRequest(new { message = "Current password is incorrect" });

                    user.PasswordHash = dto.NewPassword;
                    user.ModifiedAt = DateTime.Now;

                    await _db.SaveChangesAsync();
                    return Ok(new { message = "Password changed successfully" });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "Error changing password", error = ex.Message });
                }
            }
        }
    public class LoginDTO
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }

    public class UpdateUserDTO
    {
        public string Name { get; set; }
        public string Email { get; set; }
    }

    public class ChangePasswordDTO
    {
        [Required]
        public string CurrentPassword { get; set; }

        [Required]
        [MinLength(6)]
        public string NewPassword { get; set; }
    }
}
