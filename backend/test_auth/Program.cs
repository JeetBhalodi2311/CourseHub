using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Net.Http.Headers;

class Program
{
    static async Task Main(string[] args)
    {
        var handler = new HttpClientHandler
        {
            ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => { return true; }
        };
        using var client = new HttpClient(handler);
        client.BaseAddress = new Uri("http://localhost:5000");

        Console.WriteLine("Registering Admin User...");
        var registerPayload = new
        {
            name = "Admin Test",
            email = "admin2@test.com",
            passwordHash = "password123",
            role = "Admin"
        };
        var registerContent = new StringContent(JsonSerializer.Serialize(registerPayload), Encoding.UTF8, "application/json");
        var registerResponse = await client.PostAsync("/api/users", registerContent);
        Console.WriteLine($"Register Status: {registerResponse.StatusCode}");
        
        var responseContent = await registerResponse.Content.ReadAsStringAsync();
        Console.WriteLine($"Register Body: {responseContent}");


        Console.WriteLine("\nLogging In...");
        var loginPayload = new
        {
            email = "admin2@test.com",
            password = "password123"
        };
        var loginContent = new StringContent(JsonSerializer.Serialize(loginPayload), Encoding.UTF8, "application/json");
        var loginResponse = await client.PostAsync("/api/users/login", loginContent);
        
        if (loginResponse.IsSuccessStatusCode)
        {
            var content = await loginResponse.Content.ReadAsStringAsync();
            var result = JsonDocument.Parse(content);
            var token = result.RootElement.GetProperty("token").GetString();
            Console.WriteLine($"Obtained Token: {token.Substring(0, 20)}...");

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            
            Console.WriteLine("\nTesting GET /api/categories");
            var getCats = await client.GetAsync("/api/categories");
            Console.WriteLine($"GET Status: {getCats.StatusCode}");

            Console.WriteLine("\nTesting POST /api/categories");
            var postPayload = new { categoryName = "Test C#", imageUrl = "test" };
            var postCatContent = new StringContent(JsonSerializer.Serialize(postPayload), Encoding.UTF8, "application/json");
            var postCats = await client.PostAsync("/api/categories", postCatContent);
            Console.WriteLine($"POST Status: {postCats.StatusCode}");
        }
        else
        {
            Console.WriteLine($"Login Failed: {loginResponse.StatusCode}");
        }
    }
}
