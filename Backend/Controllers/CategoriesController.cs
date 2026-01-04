using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CourseHub.Models;
using System;
using CourseHub.Data;

namespace CourseHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _db;

        public CategoriesController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                return Ok(await _db.Categories.ToListAsync());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting categories", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var category = await _db.Categories.FindAsync(id);
            if (category == null)
                return NotFound(new { message = "Category not found" });

            return Ok(category);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CategoryDTO dto)
        {
            try
            {
                var exists = await _db.Categories.AnyAsync(c => c.CategoryName == dto.CategoryName);
                if (exists)
                    return BadRequest(new { message = "Category already exists" });

                var category = new Category
                {
                    CategoryName = dto.CategoryName,
                    ImageUrl = dto.ImageUrl,
                    CreatedAt = DateTime.Now,
                    ModifiedAt = DateTime.Now
                };

                _db.Categories.Add(category);
                await _db.SaveChangesAsync();

                return Created("", category);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating category", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, CategoryDTO dto)
        {
            try
            {
                var category = await _db.Categories.FindAsync(id);
                if (category == null)
                    return NotFound(new { message = "Category not found" });

                category.CategoryName = dto.CategoryName;
                category.ImageUrl = dto.ImageUrl;
                category.ModifiedAt = DateTime.Now;

                await _db.SaveChangesAsync();
                return Ok(category);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating category", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var category = await _db.Categories.FindAsync(id);
                if (category == null)
                    return NotFound(new { message = "Category not found" });

                _db.Categories.Remove(category);
                await _db.SaveChangesAsync();

                return Ok(new { message = "Category deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting category", error = ex.Message });
            }
        }
    }
}
