using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain.Entities;
using PdfSharpCore.Drawing;
using PdfSharpCore.Pdf;

namespace Application.utils
{
    public class PdfService : IPdfService
    {
        public Task<byte[]> GenerateTripPdfAsync(Trip trip, string? city, string? country)
        {
            using var stream = new MemoryStream();
            var document = new PdfDocument();
            var page = document.AddPage();
            var gfx = XGraphics.FromPdfPage(page);

            var black = XBrushes.Black;
            var gray = new XSolidBrush(XColor.FromArgb(240, 240, 240));
            var darkGray = new XSolidBrush(XColor.FromArgb(50, 50, 50));

            var fontTitle = new XFont("Arial", 22, XFontStyle.Bold);
            var fontSection = new XFont("Arial", 14, XFontStyle.Bold);
            var fontBody = new XFont("Arial", 12, XFontStyle.Regular);

            int marginX = 40;
            int y = 50;

            gfx.DrawString(trip.Title ?? "Untitled", fontTitle, black, new XPoint(marginX, y));
            y += 10;

            gfx.DrawLine(XPens.LightGray, marginX, y, page.Width - marginX, y);
            y += 20;

            gfx.DrawString("Created by:", fontSection, darkGray, new XPoint(marginX, y));
            gfx.DrawString($"{trip.User?.FirstName} {trip.User?.LastName}", fontBody, black, new XPoint(marginX + 100, y));
            y += 30;

            gfx.DrawString("Dates:", fontSection, darkGray, new XPoint(marginX, y));
            gfx.DrawString($"{trip.StartDate:dd.MM.yyyy} - {trip.EndDate:dd.MM.yyyy}", fontBody, black, new XPoint(marginX + 100, y));
            y += 30;

            gfx.DrawString("Rating:", fontSection, darkGray, new XPoint(marginX, y));
            gfx.DrawString(trip.Rating != null ? $"{trip.Rating.Rate}/5" : "Not rated", fontBody, black, new XPoint(marginX + 100, y));
            y += 40;

            gfx.DrawString("Location: ", fontSection, darkGray, new XPoint(marginX, y));
            gfx.DrawString((city != null && country != null) ? $"{country}, {city}" : "Not found", fontBody, black, new XPoint(marginX + 100, y));            
            y += 40;

            gfx.DrawString("Description:", fontSection, darkGray, new XPoint(marginX, y));
            y += 20;

            var descriptionText = trip.Description ?? "No description.";
            var descriptionRect = new XRect(marginX, y, page.Width - 2 * marginX, page.Height - y - 40);
            gfx.DrawRectangle(gray, descriptionRect);
            gfx.DrawString(descriptionText, fontBody, black, descriptionRect, XStringFormats.TopLeft);

            document.Save(stream, false);
            return Task.FromResult(stream.ToArray());

        }
    }
}
