using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Enums;

namespace Application.DTOs
{
    public class TripFilterRequest
    {
        public string? Title {  get; set; }
        public TripStatus? Status { get; set; }
        public DateTime? StartDate { get; set; }
        public int Rate {  get; set; }
    }
}
