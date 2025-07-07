

namespace Application.DTOs
{
    public class AuthResponse
    {
        public string? Email {  get; set; }
        public string? AccessToken {  get; set; }
        public int TokenValidityMins { get; set; }
    }
}
