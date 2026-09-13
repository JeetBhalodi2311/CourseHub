

async function test() {
    try {
        const response = await fetch('http://localhost:5000/api/Courses');
        if (!response.ok) throw new Error('Failed to fetch courses: ' + response.statusText);
        const data = await response.json();

        const mapped = data.map(course => ({
            id: (course.id || course.Id || '').toString(),
            title: course.title || course.Title,
            description: course.description || course.Description,
            price: course.price || course.Price,
            rating: course.averageRating || course.AverageRating || 0,
            totalReviews: 0,
            thumbnail: course.imageUrl || course.ImageUrl || 'https://img-c.udemycdn.com/course/480x270/851712_fc61_6.jpg',
            category: course.category?.categoryName || course.Category?.CategoryName || course.category?.name || course.Category?.Name || 'Uncategorized',
            categoryImage: course.category?.imageUrl || '',
            instructorId: course.instructorId?.toString() || '',
            instructorName: course.instructor?.name || 'Unknown Instructor',
            lectures: course.lectures || course.Lectures || []
        }));
        console.log("MAPPED COURSES:", mapped);
    } catch (e) {
        console.error("ERROR:", e);
    }
}

test();
