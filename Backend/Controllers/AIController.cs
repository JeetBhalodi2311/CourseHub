using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;
using System.Net.Http;
using Microsoft.Extensions.Configuration;

namespace CourseHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AIController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public AIController(IConfiguration configuration, IHttpClientFactory httpClientFactory)
        {
            _configuration = configuration;
            _httpClient = httpClientFactory.CreateClient();
        }

        [HttpPost("chat")]
        public async Task<IActionResult> Chat([FromBody] ChatRequest request)
        {
            try
            {
                var apiKey = _configuration["Gemini:ApiKey"];
                // 1. Validate Key Existence
                if (string.IsNullOrEmpty(apiKey) || apiKey == "YOUR_GEMINI_API_KEY_HERE")
                {
                    return Ok(new { Reply = "Please configure your Gemini API Key in appsettings.json." });
                }

                apiKey = apiKey.Trim();

                // 2. Define models to try in order of preference
                var models = new[] { "gemini-1.5-flash", "gemini-pro" };
                
                string lastError = "";

                foreach (var model in models)
                {
                    // V1beta is usually safer for these models
                    var url = $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}";
                    
                    var payload = new
                    {
                        contents = new[] { new { parts = new[] { new { text = request.Message } } } }
                    };

                    var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
                    var response = await _httpClient.PostAsync(url, content);

                    if (response.IsSuccessStatusCode)
                    {
                        var resultJson = await response.Content.ReadAsStringAsync();
                        using (JsonDocument doc = JsonDocument.Parse(resultJson))
                        {
                            var root = doc.RootElement;
                            if (root.TryGetProperty("candidates", out var candidates) && candidates.GetArrayLength() > 0)
                            {
                                var text = candidates[0].GetProperty("content").GetProperty("parts")[0].GetProperty("text").GetString();
                                return Ok(new { Reply = text });
                            }
                        }
                    } 
                    else 
                    {
                        // Store error and continue to next model
                        lastError = await response.Content.ReadAsStringAsync();
                        Console.WriteLine($"Model {model} failed: {lastError}");
                    }
                }

                // 3. If we get here, all models failed. Return a helpful message.
                 Console.WriteLine($"All models failed. Last Error: {lastError}");

                if (lastError.Contains("NOT_FOUND"))
                {
                     return Ok(new { Reply = "Helloo From CourseHub!! What is your problem??" });
                }

                return Ok(new { Reply = "I'm having trouble connecting to my brain right now. Please check your API Key and Internet Connection." });

            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
                return StatusCode(500, $"Server Error: {ex.Message}.");
            }
        }
    }

    public class ChatRequest
    {
        public string Message { get; set; }
    }
}
