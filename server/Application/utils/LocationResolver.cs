using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Application.utils
{
    public class LocationResolver
    {
        private readonly HttpClient _httpClient = new HttpClient();

        public async Task<(string? City, string? Country)> GetLocationAsync(double lat, double lon)
        {
            var url = $"https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}&format=json&accept-language=en";
            _httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("YourAppName/1.0");

            var response = await _httpClient.GetAsync(url);
            if (!response.IsSuccessStatusCode) return (null, null);

            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);

            var root = doc.RootElement;
            var address = root.GetProperty("address");

            string? city = address.TryGetProperty("city", out var c) ? c.GetString() : null;
            city ??= address.TryGetProperty("town", out var t) ? t.GetString() : null;
            city ??= address.TryGetProperty("village", out var v) ? v.GetString() : null;

            string? country = address.TryGetProperty("country", out var co) ? co.GetString() : null;

            return (city, country);
        }
    }
}
