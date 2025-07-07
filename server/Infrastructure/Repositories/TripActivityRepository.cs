using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class TripActivityRepository : RepositoryFactory<TripActivity>, ITripActivityRepository
    {
        public TripActivityRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<List<TripActivity>> GetAllByTrip(int tripId)
        {
            return await _context.TripActivities
                .Where(x => x.TripId == tripId)
                .Include(x => x.Location)
                .Include (x => x.Images)
                .ToListAsync();

        }

        public async Task<double?> GetAverageRateByTrip(int tripId)
        {
            double? avgRate = await _context.TripActivities
                .Where(x => x.TripId == tripId && x.Status == TripActivityStatus.Completed)
                .AverageAsync(x => (double?)x.Rate);
            if (avgRate == null) return 0;
            return avgRate;
        }

        public async Task<TripActivity?> GetById(int id)
        {
            return await _context.TripActivities
                .Include(x => x.Location)
                .Include(x => x.Images)
                .SingleOrDefaultAsync(x => x.Id == id);
        }

        public async Task<int> GetCountActiveActivities(int tripId)
        {
            return await _context.TripActivities
                .Where(a => a.TripId == tripId)
                .CountAsync();
        }

        public async Task<TripActivity?> GetLastCompleted(int tripId)
        {
            return await _context.TripActivities
            .Where(x => x.Status == TripActivityStatus.Completed && x.TripId == tripId)
            .OrderByDescending(x => x.EndDate)
            .FirstOrDefaultAsync();

        }
    }
}
