using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class TripRepository : RepositoryFactory<Trip>, ITripRepository
    {
        public TripRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<List<Trip>> Filter(string title, TripStatus? status, DateTime? startDate, DateTime? endDate, int rate, int userId)
        {
            var query = _context.Trips.AsQueryable();

            query = query.Where(x => x.UserId == userId);

            if (!string.IsNullOrWhiteSpace(title))
                query = query.Where(x => x.Title.ToLower().Contains(title.ToLower()));

            if (status != null)
                query = query.Where(x => x.Status == status);

            if (startDate != null)
                query = query.Where(x => x.StartDate >= startDate);
            if (endDate != null)
                query = query.Where(x => x.EndDate <= endDate);

            if(rate != 0)
            {
                query = query.Where(x => x.Rating != null && x.Rating.TripId == x.Id && x.Rating.Rate >= rate);
            }
            query = query.Include(x => x.Images)
                .Include(x => x.User)
                .Include(x => x.Rating)
                .Include(x => x.Location)
                .Include(x => x.TripActivities);
            return await query.ToListAsync();
        }

        public async Task<Trip?> GetByTitle(string title, int userId)
        {
            return await _context.Trips.SingleOrDefaultAsync(x => x.Title == title && x.UserId == userId);
        }

        public async Task<int> GetCountStartedTrip(int userId)
        {
            return await _context.Trips.CountAsync(x => x.Status == Domain.Enums.TripStatus.InProgress &&
                x.UserId == userId);
        }

        public async Task<Trip?> GetFull(int id, int userId)
        {
            return await _context.Trips
                .Include(x => x.Images)
                .Include(x => x.User)
                .Include(x => x.Rating)
                .Include(x => x.Location)
                .Include(x => x.TripActivities)
                .SingleOrDefaultAsync(x => x.Id == id && x.UserId == userId);
        }

        public async Task<Trip?> GetWithImages(int id)  
        {
            return await _context.Trips
                .Include(x => x.Images)
                .Include(x => x.User)
                .SingleOrDefaultAsync(x => x.Id == id);
        }
    }
}
