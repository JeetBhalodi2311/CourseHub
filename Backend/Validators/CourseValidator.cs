using FluentValidation;
using CourseHub.Models;

namespace CourseHub.Validators
{
    public class CourseValidator : AbstractValidator<CourseDTO>
    {
        public CourseValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required.")
                .MaximumLength(200).WithMessage("Title cannot exceed 200 characters.");

            RuleFor(x => x.Price)
                .GreaterThanOrEqualTo(0).WithMessage("Price must be a non-negative value.");

            RuleFor(x => x.InstructorId)
                .GreaterThan(0).WithMessage("InstructorId must be valid.");
                
            RuleFor(x => x.CategoryId)
                .GreaterThan(0).WithMessage("CategoryId must be valid.");
        }
    }
}
