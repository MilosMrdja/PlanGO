
using Application.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class AccountRepository : RepositoryFactory<Account>, IAccountRepository
    {
        public AccountRepository(AppDbContext context) : base(context)
        {
        }
        public async Task<Account?> GetByEmailAsync(string email)
        {   
            return await _context.Accounts.SingleOrDefaultAsync(x => x.Email == email);
        }
    }
}
