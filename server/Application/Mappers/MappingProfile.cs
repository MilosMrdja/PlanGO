using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs;
using AutoMapper;
using Domain.Entities;

namespace Application.Mappers
{
    public class MappingProfile : Profile
    {
        public MappingProfile() { 
            CreateMap<Image, ImageResponse>();

            CreateMap<Trip, TripResponse>()
                .ForMember(dest => dest.Images, opt => opt.MapFrom(src => src.Images));

            CreateMap<Location, LocationDTO>()
                .ForMember(dest => dest.Latitude, opt => opt.MapFrom(src => src.Coordinates.Y))
                .ForMember(dest => dest.Longitude, opt => opt.MapFrom(src => src.Coordinates.X));

            CreateMap<User, UserResponse>();

            CreateMap<Rating, RatingResponse>();

            CreateMap<RatingRequest, Rating>()
                .ForMember(dest => dest.TripId, opt => opt.MapFrom(src => src.tripId));

            CreateMap<TripActivity, TripActivityResponse>();

            CreateMap<TripActivityRequest, TripActivity>();
        }
    }
}
