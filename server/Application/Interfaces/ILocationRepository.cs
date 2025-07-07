using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;
using NetTopologySuite.Geometries;

namespace Application.Interfaces
{
    public interface ILocationRepository : IRepository<Domain.Entities.Location>
    {
        Task<Domain.Entities.Location?> GetByPoint(Point point);
    }
}
