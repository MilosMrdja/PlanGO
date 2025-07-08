using System.Security.Claims;
using Application.DTOs;
using Application.Services;
using Application.utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ValidateController
    {
        private readonly AuthService _authService;
        public AuthController(AuthService authService, IHttpContextAccessor httpContextAccessor)
        {
            _authService = authService;
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var email = User.FindFirst(ClaimTypes.Email)?.Value;

            return Ok(new { userId, email });
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
                return HandleInvalidModelStateSingleMessage();

            var response = await _authService.Register(request);

            return Ok(new ApiResponse<AuthResponse>(response));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody]LoginRequest loginDto)
        {
            if (!ModelState.IsValid)
                return HandleInvalidModelStateSingleMessage();
            var response = await _authService.Login(loginDto);

            if (response == null)
                return Unauthorized("Invalid credentials");

            return Ok(new ApiResponse<AuthResponse>(response));
        }
        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout() { return Ok(); }
    }
}
