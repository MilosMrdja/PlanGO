﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Application.Interfaces.Mappers;
using Application.utils;
using Domain.Entities;
using Domain.Enums;
using Microsoft.AspNetCore.Http;
using NetTopologySuite.Triangulate.Tri;

namespace Application.Services
{
    public class TripService
    {
        private readonly ITripRepository _tripRepository;
        private readonly ITripActivityRepository _tripActivityRepository;
        private readonly ITripMapper _tripMapper;
        private readonly IPdfService _pdfService;
        private readonly AuthService _authService;
        private readonly ImageService _imageService;
        private readonly LocationServices _locationServices;
        private readonly RatingService _ratingService;
        private readonly LocationResolver _locationResolver;
        public TripService(ITripRepository tripRepository, AuthService auth, ImageService imageService,
            ITripMapper tripMapper, LocationServices locationServices, RatingService ratingService, ITripActivityRepository tripActivityRepository,
            IPdfService pdfService, LocationResolver locationResolver)
        {
            _tripRepository = tripRepository;
            _authService = auth;
            _imageService = imageService;
            _tripMapper = tripMapper;
            _locationServices = locationServices;
            _ratingService = ratingService;
            _tripActivityRepository = tripActivityRepository;
            _pdfService = pdfService;
            _locationResolver = locationResolver;
        }

        public async Task<TripResponse?> GetById(int id)
        {
            var userId = _authService.GetCurrentUserId() ?? throw new Exception("Error occured - current user");
            return _tripMapper.toResponseDTO(await _tripRepository.GetFull(id, int.Parse(userId)) ?? new Trip());
        }
        

        public async Task<TripResponse> CreateTrip(CreateTripRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Title)) { throw new Exception("Title is not valid"); }
            var id = _authService.GetCurrentUserId() ?? throw new Exception("Error occured - current user");
            Trip? trip = await _tripRepository.GetByTitle(request.Title, int.Parse(id));
            if (trip != null)
            {
                throw new Exception("Trip with this title already exist");
            }
            
            var createdTrip = await _tripRepository.AddAsync(new Trip
            {
                Title = request.Title,
                UserId = int.Parse(id),
                Status = Domain.Enums.TripStatus.Planned
            }) ;
            return new TripResponse
            {
                Title = createdTrip.Title
            };
        }

        public async Task<TripResponse> StartTrip(int id, UpdateTripRequest request)
        {
            var trip = await _tripRepository.GetByIdAsync(id) ?? throw new Exception($"Trip not found with id: {id}");

            if(await _tripRepository.GetCountStartedTrip(trip.UserId) > 0)
            {
                throw new Exception("You already have trip in progress. You can not have two started trip at the same time.");
            }

            if(trip.Status != Domain.Enums.TripStatus.Planned)
            {
                throw new Exception("Trip must be planned, before start");
            }
            if (request.Location != null)
            {
                trip.LocationId = await _locationServices.CreateLocation(request.Location) ?? trip.LocationId;
            }

            if (request.StartDate != null)
            {
                var startDate = (DateTime)request.StartDate;

                if (startDate > DateTime.UtcNow)
                    throw new Exception("Start date can not be in the future");

                trip.StartDate = DateTime.SpecifyKind(startDate, DateTimeKind.Utc);
            }
            else
            {
                throw new Exception("Trip must have start date");
            }
            trip.Status = Domain.Enums.TripStatus.InProgress;
            var updatedTrip = await _tripRepository.UpdateAsync(trip) ?? throw new Exception("Error in Database");
           
            return _tripMapper.toResponseDTO(updatedTrip);
        } 

        public async Task<TripResponse> FinishTrip(int id, UpdateTripRequest request)
        {
            var trip = await _tripRepository.GetByIdAsync(id) ?? throw new Exception($"Trip not found with id: {id}");

            if (trip.Status != Domain.Enums.TripStatus.InProgress)
            {
                throw new Exception("Trip must be in progress");
            }

            if(await _tripActivityRepository.GetCountActiveActivities(trip.Id) > 0)
            {
                throw new Exception("Trip is not finished, you still have active activities");
            }
            if (request.EndDate != null)
            {
                if (request.EndDate < trip.StartDate)
                {
                    throw new Exception("End date must be after start date");
                }
                TripActivity? tripActivity = await _tripActivityRepository.GetLastCompleted(trip.Id);
                if (tripActivity != null)
                {
                    if (tripActivity.EndDate > request.EndDate)
                    {
                        throw new Exception("Trip must be completed after trip activity end date");
                    }
                }
                trip.EndDate = DateTime.SpecifyKind((DateTime)request.EndDate, DateTimeKind.Utc);
            }

            // trip must contains rating
            if (request.Rating != null)
            {
                if(request.Rating.Rate == 0)
                {
                    request.Rating.Rate = await _tripActivityRepository.GetAverageRateByTrip(trip.Id);
                    if(request.Rating.Rate <= 0) { request.Rating.Rate = 1; }
                }
                request.Rating.tripId = trip.Id;
                trip.Rating = await _ratingService.Create(request.Rating);
            }
            else
            {
                throw new Exception("Trip must be evaluated");
            }

            // option to upload images
            if (request.Images != null)
            {
                await _imageService.UploadImages(request.Images, id, true);
            }



            trip.Status = TripStatus.Completed;
            var updatedTrip = await _tripRepository.UpdateAsync(trip) ?? throw new Exception("Error in Database");

            return _tripMapper.toResponseDTO(updatedTrip);
        }

        public async Task<TripResponse> UpdateTrip(int id, UpdateTripRequest request)
        {
            var trip = await _tripRepository.GetWithImages(id) ?? throw new Exception($"Trip not found with id: {id}");
            if(request.Title == null) { throw new Exception("Trip must have a title"); }
            if (trip.Status == Domain.Enums.TripStatus.Completed)
            {
                throw new Exception("You can not change finished trip");
            }
            Trip? tripCheck = await _tripRepository.GetByTitle(request.Title, trip.UserId);
            if (request.Title!= null && tripCheck != null)
            {
                
                if (tripCheck!=null && trip.Id != tripCheck.Id)
                {
                    throw new Exception("Trip with this title already exist");
                }
            }

            trip.Title = request.Title;
            trip.Description = request.Description ?? trip.Description;
            if(trip.Status == Domain.Enums.TripStatus.InProgress)
            {
                if (request.Images != null)
                {
                    await _imageService.UploadImages(request.Images, id, true);
                }
                if (request.ImagesToDelete != null)
                {
                    await _imageService.DeleteImages(request.ImagesToDelete);
                }
            }
            
            if (request.Location != null)
            {
                trip.LocationId = await _locationServices.CreateLocation(request.Location) ?? trip.LocationId;
            }

            
            var updatedTrip = await _tripRepository.UpdateAsync(trip) ?? throw new Exception("Error in Database");
            updatedTrip.User = trip.User;


            return _tripMapper.toResponseDTO(updatedTrip);
        }

        public async Task<List<TripResponse>> GetAll(TripFilterRequest request)
        {
            List<Trip> trips = await _tripRepository.Filter(request.Title, request.Status, request.StartDate, request.EndDate, request.RateMin, request.RateMax == 0? 5 : request.RateMax, int.Parse(_authService.GetCurrentUserId()));

            return trips.Select(t => _tripMapper.toResponseDTO(t)).ToList();

        }
        public async Task<(string FileName, byte[] FileBytes)> GenerateTripPdfAsync(int id)
        {
            var userId = _authService.GetCurrentUserId() ?? throw new Exception("Error occured - current user");
            Trip trip = await _tripRepository.GetFull(id, int.Parse(userId)) ?? throw new Exception("Trip not found");
            if(trip.Status != TripStatus.Completed)
            {
                throw new Exception("Trip must be completed, then you can download report");
            }
            string? city = null;
            string? country = null;

            if (trip.Location != null)
            {
                (city, country) = await _locationResolver.GetLocationAsync(
                    trip.Location.Coordinates.Y,
                    trip.Location.Coordinates.X
                );
            }

            var pdfBytes = await _pdfService.GenerateTripPdfAsync(trip, city, country);
            var fileName = $"Trip-{trip.Title}.pdf";
            return (fileName, pdfBytes);
        }
        public async Task<bool> ArchiveTrip(int id)
        {
            Trip trip = await _tripRepository.GetByIdAsync(id) ?? throw new Exception("Trip not found");
            if (trip.Status != TripStatus.Completed) throw new Exception("Trip can not be archived while it is not completed trip");
            trip.IsArchive = true;
            if(await _tripRepository.UpdateAsync(trip) != null)
            {
                return true;
            }
            return false;
            
        }
        public async Task<bool> UnarchiveTrip(int id)
        {
            Trip trip = await _tripRepository.GetByIdAsync(id) ?? throw new Exception("Trip not found");
            if (trip.IsArchive == false) { throw new Exception("Trip is already unarchived"); }
            trip.IsArchive = false;
            if (await _tripRepository.UpdateAsync(trip) != null)
            {
                return true;
            }
            return false;

        }

        public async Task<List<TripResponse>> getArchived()
        {
            var userId = _authService.GetCurrentUserId() ?? throw new Exception("Error occured - current user");
            List<Trip> trips = await _tripRepository.GetArchived(int.Parse(userId));
            return trips.Select(t => _tripMapper.toResponseDTO(t)).ToList();
        }
    }
}
