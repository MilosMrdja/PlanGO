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
    public class TripActivityMapper : ITripActivityMapper
    {
        private readonly IMapper _mapper;

        public TripActivityMapper(IMapper mapper)
        {
            _mapper = mapper;
        }

        public TripActivity toEntity(TripActivityRequest tripActivityRequest)
        {
            return _mapper.Map<TripActivity>(tripActivityRequest);
        }

        public TripActivityResponse toResponseDTO(TripActivity tripActivity)
        {
            return _mapper.Map<TripActivityResponse>(tripActivity);
        }
    }
}
