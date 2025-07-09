using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Application.DTOs
{
    public class TripActivityRequest
    {
        public string? Title { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        [Range(1, 5)]
        public int? Rate { get; set; }
        public string? Comment { get; set; }

        public LocationDTO? Location { get; set; }
        public int TripId { get; set; }
        public IFormFile[]? Images { get; set; }
        public string[]? ImagesToDelete { get; set; }
    }
}
