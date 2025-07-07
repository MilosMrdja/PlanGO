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
using NetTopologySuite.Geometries;

namespace Application.Services
{
    public class LocationServices
    {
        private readonly ILocationRepository _locationRepository;
        private readonly GeometryFactory _geometryFactory;
        private readonly ILocationMapper _locationMapper;

        public LocationServices(ILocationRepository locationRepository, GeometryFactory geometryFactory, ILocationMapper locationMapper)
        {
            _locationRepository = locationRepository;
            _geometryFactory = geometryFactory;
            _locationMapper = locationMapper;
        }

        public async Task<int?> CreateLocation(LocationDTO request)
        {
            var point = _geometryFactory.CreatePoint(new Coordinate(request.Longitude, request.Latitude));

            Domain.Entities.Location? existedLocation = await _locationRepository.GetByPoint(point);
            if (existedLocation != null)
            {
                return existedLocation.Id;
            }


            Domain.Entities.Location? location = await _locationRepository.AddAsync(new Domain.Entities.Location
            {
                Coordinates = point
            });

            if(location == null) { return null; }
            return location.Id;
        }

        public async Task<LocationDTO?> GetLocation(int id)
        {
            return _locationMapper.toResponseDTO(await _locationRepository.GetByIdAsync(id)??throw new Exception("Something wrong in Database"));
        }
    }
}
