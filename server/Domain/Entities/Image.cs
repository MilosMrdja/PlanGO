using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    [Table("images")]
    public class Image
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public required string ImageURL { get; set; }
        [ForeignKey(nameof(Trip))]
        public int? TripId { get; set; }

        [ForeignKey(nameof(TripActivity))]
        public int? TripActivityId { get; set;}
    }
}
