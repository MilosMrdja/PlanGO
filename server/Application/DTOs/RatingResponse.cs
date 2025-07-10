using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class RatingResponse
    {
        public int Id {  get; set; }
        [Range(1, 5)]
        public double? Rate { get; set; }
        public string Comment {  get; set; }
    }
}
