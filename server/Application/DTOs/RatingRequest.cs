using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class RatingRequest
    {
        [Range(0,5)]
        public int Rate {  get; set; }
        public string Comment {  get; set; }

        public int tripId {  get; set; }
    }
}
