using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Domain.Enums;

namespace Application.DTOs
{
    public class TripResponse
    {
        public string Title { get; set; }

        public string? Description { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public TripStatus? Status { get; set; }
        public List<ImageResponse> Images { get; set; } = new List<ImageResponse>();
        public LocationDTO Location { get; set; }
        public UserResponse User { get; set; }
        public RatingResponse Rating { get; set; }
        public List<TripActivityResponse> TripActivities { get; set; }
       
    }
}
