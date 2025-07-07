using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    [Table("users")]
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(30)]
        public required string FirstName { get; set; }

        [Required, MaxLength(30)]
        public required string LastName { get; set; }
        public int Age {  get; set; }

        public Account? Account { get; set; }

        public ICollection<Trip> Trips { get; set; } = new List<Trip>();
    }
}
