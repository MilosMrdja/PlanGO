using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Enums;
using Microsoft.AspNetCore.Http;

namespace Application.DTOs
{
    public class UpdateTripRequest
    {
        public string? Title {  get; set; }
        public string? Description { get; set; }
        public IFormFile[]? Images { get; set; }
        public string[]? ImagesToDelete { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public TripStatus? Status { get; set; }
        public LocationDTO? Location { get; set; }
        public RatingRequest? Rating { get; set; }

    }
}
