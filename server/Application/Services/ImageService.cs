using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.utils;
using Domain.Entities;
using Microsoft.AspNetCore.Http;

namespace Application.Services
{
    public class ImageService
    {
        private readonly IImageRepository _imageRepository;

        public ImageService(IImageRepository imageRepository)
        {
            _imageRepository = imageRepository;
        }


        public async Task UploadImages(IFormFile[] images, int id, bool isTripImage)
        {
            if (images.Length > 0)
            {
                foreach (var file in images)
                {
                    var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
                    var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "uploads");
                    Directory.CreateDirectory(folderPath);
                    var fullPath = Path.Combine(folderPath, fileName);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                    var image = new Image
                        { ImageURL = $"/images/uploads/{fileName}" };
                    
                    if (isTripImage)
                    {
                        image.TripId = id;
                    }
                    else
                    {
                        image.TripActivityId = id;
                    }
                    
                    await _imageRepository.AddAsync(image);
                }
            }
        }

        public async Task DeleteImages(string[] imagesToDelete)
        {
            foreach (var imageUrl in imagesToDelete)
            {
                var image = await _imageRepository.GetByURL(imageUrl) ?? throw new Exception($"Image not found with {imageUrl} url");

                if (image != null)
                {
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", image.ImageURL.TrimStart('/'));
                    if (File.Exists(filePath))
                        File.Delete(filePath);

                    await _imageRepository.DeleteAsync(image);
                }
            }
        }
    }
}
