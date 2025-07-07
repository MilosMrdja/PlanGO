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
    public class LocationMapper : ILocationMapper
    {
        private readonly IMapper _mapper;
        public LocationMapper(IMapper mapper) {
            _mapper = mapper;
        }
        public LocationDTO toResponseDTO(Location loc)
        {
            return _mapper.Map<LocationDTO>(loc);
        }
    }
}
