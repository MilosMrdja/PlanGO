using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class RatingRepository : RepositoryFactory<Rating>, IRatingRepository
    {
        public RatingRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<Rating?> GetByTrip(int tripId)
        {
            return await _context.Ratings.FirstOrDefaultAsync(x => x.TripId == tripId);
        }
    }
}
