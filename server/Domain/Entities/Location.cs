using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NetTopologySuite.Geometries;

namespace Domain.Entities
{
    [Table("locations")]
    public class Location
    {
        [Key]
        public int Id { get; set; }
        public required Point Coordinates { get; set; }

    }
}
