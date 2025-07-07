using Domain.Entities;
using Application.Interfaces;

namespace Infrastructure.Repositories
{
    public class UserRepository : RepositoryFactory<User>, IUserRepository
    {

        public UserRepository(AppDbContext context) : base(context) { }


    }
}
 