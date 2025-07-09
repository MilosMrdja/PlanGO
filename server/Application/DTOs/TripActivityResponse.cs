using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Domain.Enums;

namespace Application.DTOs
{
    public class TripActivityResponse
    {
        public int Id { get; set; }
        public string Title {  get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        [Range(1, 5)]
        public int? Rate { get; set; }
        public string? Comment { get; set; }

        public LocationDTO Location { get; set; }
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public TripActivityStatus? Status { get; set; }
        public List<ImageResponse> Images { get; set; } = new List<ImageResponse>();
        public TripStatus TripStatus { get; set; }
    }
}
