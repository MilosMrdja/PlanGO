using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;

namespace Application.Interfaces
{
    public interface IImageRepository : IRepository<Image>
    {
        Task<Image?> GetByURL(string url);
        Task DeleteImagesByActivity(int id);
    }
}
