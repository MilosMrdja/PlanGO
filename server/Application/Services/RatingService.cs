using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Application.Interfaces.Mappers;
using Application.utils;
using Domain.Entities;

namespace Application.Services
{
    public class RatingService
    {
        private readonly IRatingRepository _ratingRepository;
        private readonly IRatingMapper _ratingMapper;

        public RatingService(IRatingRepository ratingRepository, IRatingMapper ratingMapper)
        {
            _ratingRepository = ratingRepository;
            _ratingMapper = ratingMapper;
        }

        public async Task<RatingResponse?> GetById(int id)
        {
            return (await _ratingRepository.GetByIdAsync(id)) is { } rating
                ? _ratingMapper.toResponseDTO(rating)
                : null;

        }

        public async Task<Rating?> Create(RatingRequest request)
        {
            Rating? r = await _ratingRepository.AddAsync(_ratingMapper.toEntity(request)) ?? throw new Exception("Database error");
            return r;
        }

        public async Task DeleteByTripId(int tripId)
        {
            Rating r = await _ratingRepository.GetByTrip(tripId) ?? throw new Exception($"Rating for trip with id: {tripId} does not exist");

            await _ratingRepository.DeleteAsync(r);
        }
    }
}
