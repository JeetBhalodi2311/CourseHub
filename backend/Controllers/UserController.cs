using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CourseHub.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CourseHub.Data;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;

namespace CourseHub.Controllers
{
        [ApiController]
        [Route("api/[controller]")]
        public class UsersController : ControllerBase
        {
            private readonly AppDbContext _db;
            private readonly IConfiguration _configuration;

            public UsersController(AppDbContext db, IConfiguration configuration)
            {
                _db = db;
                _configuration = configuration;
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
            [AllowAnonymous]
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
            [AllowAnonymous]
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


            // POST: api/users/login
            [HttpPost("login")]
            [AllowAnonymous]
            public async Task<IActionResult> Login([FromBody] LoginDTO loginDto)
            {
                try
                {
                    if (!ModelState.IsValid)
                        return BadRequest(ModelState);

                    var user = await _db.Users
                        .Include(u => u.Instructor) 
                        .FirstOrDefaultAsync(u => u.Email == loginDto.Email && u.PasswordHash == loginDto.Password);

                    if (user == null)
                        return Unauthorized(new { message = "Invalid email or password" });

                    // Generate JWT Token
                    var token = GenerateJwtToken(user);

                    return Ok(new { token, user });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "Error logging in", error = ex.Message });
                }

            }

            private string GenerateJwtToken(User user)
            {
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
                var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var claims = new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                    new Claim(JwtRegisteredClaimNames.Email, user.Email),
                    new Claim(ClaimTypes.Name, user.Name),
                    new Claim(ClaimTypes.Role, user.Role),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                };

                var token = new JwtSecurityToken(
                    issuer: _configuration["Jwt:Issuer"],
                    audience: _configuration["Jwt:Audience"],
                    claims: claims,
                    expires: DateTime.UtcNow.AddHours(24),
                    signingCredentials: credentials
                );

                return new JwtSecurityTokenHandler().WriteToken(token);
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
