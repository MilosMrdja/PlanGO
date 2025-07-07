using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    [Table("accounts")]
    public class Account
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(255)]
        public required string Email {  get; set; }

        [Required] 
        public required string Password { get; set; }

        [ForeignKey(nameof(User))]
        public int UserId { get; set; }
        public required User User { get; set; }

    }
}
