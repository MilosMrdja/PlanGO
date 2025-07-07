using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Enums;

namespace Domain.Entities
{
    [Table("trip_activities")]
    public class TripActivity
    {
        [Key]
        public int Id { get; set; }
        [Required, MaxLength(50)]
        public string Title { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        [Range(1, 5)]
        public int? Rate {  get; set; }
        public string? Comment { get; set; }
        [Required]
        public TripActivityStatus Status { get; set; }

        public int? LocationId { get; set; }
        public Location? Location { get; set; }

        [ForeignKey(nameof(Trip))]
        public int TripId { get; set; }
        public ICollection<Image> Images { get; set; } = new List<Image>();
    }
}
