using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces.Mappers;
using AutoMapper;
using Domain.Entities;

namespace Application.Mappers
{
    public class RatingMapper : IRatingMapper
    {
        private readonly IMapper _mapper;

        public RatingMapper(IMapper mapper)
        {
            _mapper = mapper;
        }

        public Rating toEntity(RatingRequest ratingRequest)
        {
            return _mapper.Map<Rating>(ratingRequest);
        }

        public RatingResponse toResponseDTO(Rating rating)
        {
            return _mapper.Map<RatingResponse>(rating);
        }
    }
}
