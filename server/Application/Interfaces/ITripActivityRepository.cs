using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;

namespace Application.Interfaces
{
    public interface ITripActivityRepository : IRepository<TripActivity>
    {
        public Task<List<TripActivity>> GetAllByTrip(int tripId);
        public Task<TripActivity?> GetLastCompleted(int tripId);
        public Task<double?> GetAverageRateByTrip(int tripId);
        public Task<TripActivity?> GetById(int id);
        public Task<int> GetCountActiveActivities(int tripId);
    }
}
