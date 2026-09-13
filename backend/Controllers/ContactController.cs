using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CourseHub.Data;
using CourseHub.Models;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace CourseHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ContactController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/Contact
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> SendMessage([FromBody] ContactUs message)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                message.CreatedAt = DateTime.Now;
                _context.ContactMessages.Add(message);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Message sent successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error sending message", error = ex.Message, inner = ex.InnerException?.Message });
            }
        }

        // GET: api/Contact
        [HttpGet]
        public async Task<IActionResult> GetMessages()
        {
            try
            {
                var messages = await _context.ContactMessages
                    .OrderByDescending(m => m.CreatedAt)
                    .ToListAsync();

                return Ok(messages);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching messages", error = ex.Message });
            }
        }
    }
}
