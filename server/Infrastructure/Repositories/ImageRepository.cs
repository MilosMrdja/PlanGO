using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class ImageRepository : RepositoryFactory<Image>, IImageRepository
    {
        public ImageRepository(AppDbContext context) : base(context)
        {
        }

        public async Task DeleteImagesByActivity(int id)
        {
            var imagesToDelete = await _context.Images
            .Where(img => img.TripActivityId == id)
            .ToListAsync();

                    _context.Images.RemoveRange(imagesToDelete);
                    await _context.SaveChangesAsync();
        }

        public async Task<Image?> GetByURL(string url)
        {
            return await _context.Images
                    .FirstOrDefaultAsync(i => i.ImageURL == url);
        }
    }
}
