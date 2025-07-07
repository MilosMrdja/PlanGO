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
    public class TripMapper : ITripMapper
    {
        private readonly IMapper _mapper; 

        public TripMapper(IMapper mapper)
        {
            _mapper = mapper;
        }

        public TripResponse toResponseDTO(Trip trip)
        {
            return _mapper.Map<TripResponse>(trip);
        }
    }
}
