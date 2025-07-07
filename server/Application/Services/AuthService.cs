
using System.Security.Claims;
using Application.DTOs;
using Application.Interfaces;
using Application.JWT;
using Application.utils;
using Domain.Entities;
using Microsoft.AspNetCore.Http;

namespace Application.Services
{
    public class AuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IAccountRepository _accountRepository;
        private readonly JwtGenerator _jwtGenerator;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthService(IUserRepository userRepository, IAccountRepository accountRepository, JwtGenerator jwtGenerator,
            IHttpContextAccessor httpContextAccessor)
        {
            _userRepository = userRepository;
            _accountRepository = accountRepository;
            _jwtGenerator = jwtGenerator;
            _httpContextAccessor = httpContextAccessor;
        }

        public string? GetCurrentUserId()
        {
            return _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }

        public string? GetCurrentUserEmail()
        {
            return _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.Email)?.Value;
        }

        public async Task<AuthResponse?> Register(RegisterRequest request)
        {
            Account acc = await _accountRepository.GetByEmailAsync(request.Email);
            if (acc!= null)
            {
                throw new Exception("User with this email already exist");
            }
            User? addedUser = await _userRepository.AddAsync(new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Age = request.Age,
            }) ?? throw new Exception("Creating account failed");

            string password = PasswordHasher.HashPassword(request.Password);

            Account? createdAccount = await _accountRepository.AddAsync(new Account
            {
                Email = request.Email,
                Password = password,
                UserId = addedUser.Id,
                User = addedUser
            }) ?? throw new Exception("Creating account failed");

            string token = _jwtGenerator.GenerateToken(createdAccount);

            return new AuthResponse() {
                Email = createdAccount.Email,
                AccessToken = token,
            };
        }

        public async Task<AuthResponse?> Login(LoginRequest loginRequest)
        {
            if(string.IsNullOrWhiteSpace(loginRequest.Email) || string.IsNullOrWhiteSpace(loginRequest.Password)) { return null; }
            // Find an account
            Account acc = await _accountRepository.GetByEmailAsync(loginRequest.Email);
            if (acc == null) { throw new Exception("Invalid email or password"); }

            // Check password
            if(!PasswordHasher.VerifyPassword(loginRequest.Password, acc.Password)) { throw new Exception("Invalid email or password"); }

            // Generate jwt token
            string token = _jwtGenerator.GenerateToken(acc);

            // Return response
            return new AuthResponse
            {
                Email = acc.Email,
                AccessToken = token
            };
        }
        
    }
}
