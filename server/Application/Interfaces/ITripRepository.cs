
using Domain.Entities;
using Domain.Enums;

namespace Application.Interfaces
{
    public interface ITripRepository : IRepository<Trip>
    {
        Task<Trip?> GetFull(int id, int userId);
        Task<Trip?> GetByTitle(string title, int userId);
        Task<Trip?> GetWithImages(int id);
        Task<int> GetCountStartedTrip(int userId);
        Task<List<Trip>> Filter(string title,TripStatus? status, DateTime? startDate,DateTime? endDate, int rate, int userId);
    }
}
