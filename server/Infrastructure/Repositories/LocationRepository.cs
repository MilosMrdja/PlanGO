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
    public class LocationRepository : RepositoryFactory<Location>, ILocationRepository
    {
        public LocationRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<Location?> GetByPoint(NetTopologySuite.Geometries.Point point)
        {
            return await _context.Locations.SingleOrDefaultAsync(x => x.Coordinates.Equals(point));
        }

      
    }
}
