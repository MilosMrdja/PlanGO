using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    [Table("ratings")]
    public class Rating
    {
        [Key]
        public int Id { get; set; }
        [Required, Range(1, 5)]
        public double Rate { get; set; }
        [Required]
        public string Comment {  get; set; }

        [ForeignKey(nameof(Trip))]
        public int TripId { get; set; }
    }
}
