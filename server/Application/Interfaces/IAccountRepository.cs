
using Domain.Entities;

namespace Application.Interfaces
{
    public interface IAccountRepository : IRepository<Account>
    {
        Task<Account?> GetByEmailAsync(string email);
    }
}
