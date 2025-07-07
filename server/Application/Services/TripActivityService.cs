using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Application.Interfaces.Mappers;
using Application.utils;
using Domain.Entities;
using NetTopologySuite.Triangulate.Tri;

namespace Application.Services
{
    public class TripActivityService
    {
        private readonly ITripActivityRepository _tripActivityRepository;
        private readonly ITripActivityMapper _tripActivityMapper;
        private readonly ITripRepository _tripRepository;
        private readonly ImageService _imageService;
        private readonly LocationServices _locationServices;

        public TripActivityService(ITripActivityRepository tripActivityRepository, ITripActivityMapper tripActivityMapper, 
            ITripRepository tripRepository, ImageService imageService, LocationServices locationServices)
        {
            _tripActivityRepository = tripActivityRepository;
            _tripActivityMapper = tripActivityMapper;
            _tripRepository = tripRepository;
            _imageService = imageService;
            _locationServices = locationServices;
        }

        public async Task<TripActivityResponse?> GetById(int id)
        {
            return _tripActivityMapper.toResponseDTO(await _tripActivityRepository.GetById(id)??throw new Exception($"Trip activity with id: {id} not found"));
        }

        public async Task<List<TripActivityResponse>> GetAllByTrip(int tripId)
        {
            return (await _tripActivityRepository.GetAllByTrip(tripId))
                .Select(_tripActivityMapper.toResponseDTO)
                .ToList();
        }

        public async Task<TripActivityResponse?> Create(TripActivityRequest request)
        {
            if(await _tripRepository.GetByIdAsync(request.TripId) == null) { throw new Exception($"Trip with id: {request.TripId} not found"); }
            if (string.IsNullOrWhiteSpace(request.Title)) { throw new Exception("Title is not valid"); }

            var createdTripActivity = await _tripActivityRepository.AddAsync(new Domain.Entities.TripActivity
            {
                TripId = request.TripId,
                Title = request.Title,
                Status = Domain.Enums.TripActivityStatus.Planned,
            });
            

            return _tripActivityMapper.toResponseDTO(createdTripActivity ?? throw new Exception("Database error"));
        }

        public async Task<TripActivityResponse?> Update(int id, TripActivityRequest request)
        {
            TripActivity tripActivity = await _tripActivityRepository.GetByIdAsync(id) ?? throw new Exception($"" +
                $"Trip activity with id: {id} not found");

            if(tripActivity.Status != Domain.Enums.TripActivityStatus.InProgress)
            {
                throw new Exception("You can not modify non active trip activity");
            }
            tripActivity.Title = request.Title ?? tripActivity.Title;
            if (request.Location != null)
            {
                tripActivity.LocationId = await _locationServices.CreateLocation(request.Location) ?? tripActivity.LocationId;
            }
            if (request.Images != null)
            {
                await _imageService.UploadImages(request.Images, id, false);
            }

            return _tripActivityMapper.toResponseDTO(await _tripActivityRepository.UpdateAsync(tripActivity) ?? new TripActivity());

        }
        public async Task<TripActivityResponse?> StartActivity(int id, TripActivityRequest request)
        {
            TripActivity tripActivity = await _tripActivityRepository.GetByIdAsync(id) ?? throw new Exception($"" +
                $"Trip activity with id: {id} not found");

            if(tripActivity.Status != Domain.Enums.TripActivityStatus.Planned) { throw new Exception("" +
                "Trip activity must be planned"); }
            if(await _tripActivityRepository.GetCountActiveActivities(id) > 0)
            {
                throw new Exception("Trip must have one trip activity maximum");
            }
            if(!await ValidateStartDate(request.StartDate ?? throw new Exception("Must enter a start date"), tripActivity.TripId))
            {
                throw new Exception("Start date is not valid");
            }
            tripActivity.StartDate = DateTime.SpecifyKind((DateTime)request.StartDate, DateTimeKind.Utc);
            if (request.EndDate != null)
            {
                if (request.Images != null)
                {
                    await _imageService.UploadImages(request.Images, id, false);
                }
                tripActivity.Rate = request.Rate ?? throw new Exception("You must leave a review"); 
                tripActivity.Comment = request.Comment ?? throw new Exception("You must leave a comment");
                tripActivity.Status = Domain.Enums.TripActivityStatus.Completed;
                return _tripActivityMapper.toResponseDTO(tripActivity);
            }
            tripActivity.Status = Domain.Enums.TripActivityStatus.InProgress;
            return _tripActivityMapper.toResponseDTO(await _tripActivityRepository.UpdateAsync(tripActivity) ??
                throw new Exception("Database error"));
        }

        private async Task<bool> ValidateStartDate(DateTime startDate, int tripId)
        {
            if(startDate > DateTime.Now) { return false; }
            Trip trip = await _tripRepository.GetByIdAsync(tripId) ?? new Trip { StartDate = DateTime.MinValue};
            if(startDate < trip.StartDate) { return false; }
            TripActivity? tripActivity = await _tripActivityRepository.GetLastCompleted(tripId);
            DateTime checkDate = DateTime.MinValue;
            if(tripActivity != null)
            {
                if(startDate < tripActivity.EndDate) { return false; }
            }
            return true;
        }

        public async Task<TripActivityResponse?> FinishActivity(int id, TripActivityRequest request)
        {
            TripActivity tripActivity = await _tripActivityRepository.GetByIdAsync(id) ?? throw new Exception($"" +
                $"Trip activity with id: {id} not found");

            if (tripActivity.Status != Domain.Enums.TripActivityStatus.InProgress)
            {
                throw new Exception("" +
                "Trip activity must be in progress");
            }
            if (request.EndDate != null)
            {
                if(request.EndDate <= tripActivity.StartDate)
                {
                    throw new Exception("End date must be after trip activity start date");
                }
                tripActivity.EndDate = DateTime.SpecifyKind((DateTime)request.EndDate, DateTimeKind.Utc);
            }
            else
            {
                throw new Exception("You must select end date");
            }
            if (request.Images != null)
            {
                await _imageService.UploadImages(request.Images, id, false);
            }
            
            tripActivity.Rate = request.Rate ?? 0;
            tripActivity.Comment = request.Comment ?? "";
            tripActivity.Status = Domain.Enums.TripActivityStatus.Completed;
            return _tripActivityMapper.toResponseDTO(await _tripActivityRepository.UpdateAsync(tripActivity) ??
                throw new Exception("Database error"));
        }

        public async Task<TripActivityResponse?> CancelActivity(int id, TripActivityRequest request)
        {
            TripActivity tripActivity = await _tripActivityRepository.GetByIdAsync(id) ?? throw new Exception($"" +
                $"Trip activity with id: {id} not found");

            if (tripActivity.Status == Domain.Enums.TripActivityStatus.InProgress
                || tripActivity.Status == Domain.Enums.TripActivityStatus.Planned)
            {
                tripActivity.Status = Domain.Enums.TripActivityStatus.Cancelled;
                if(request.Comment != null) { tripActivity.Comment = request.Comment; }
                return _tripActivityMapper.toResponseDTO(await _tripActivityRepository.UpdateAsync(tripActivity) ??
                    throw new Exception("Database error"));
            }
            else
            {
                throw new Exception("" +
                "Trip activity must be in progress");
            }
        }
        public async Task Delete(int id)
        {
            TripActivity tripActivity = await _tripActivityRepository.GetByIdAsync(id) ?? throw new Exception($"" +
                $"Trip activity with id: {id} not found");

            await _tripActivityRepository.DeleteAsync(tripActivity);
        }
    }
}
