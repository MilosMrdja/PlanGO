using Application.DTOs;
using Application.Services;
using Application.utils;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Api.Controllers
{
    [Route("api/trips")]
    [ApiController]
    [Authorize]
    public class TripController : ValidateController
    {
        private readonly TripService _tripService;

        public TripController(TripService tripService)
        {
            _tripService = tripService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] TripFilterRequest filterRequest)
        {
            var response = await _tripService.GetAll(filterRequest);
            return Ok(new ApiResponse<List<TripResponse>>(response));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var response = await _tripService.GetById(id);
            if(response == null || response.Title == null) { return NoContent(); }
            return Ok(new ApiResponse<List<TripResponse>>([response]));

        }

        [HttpPut("{id}/start")]
        public async Task<IActionResult> StartTrip(int id, [FromBody] UpdateTripRequest request)
        {
            if (!ModelState.IsValid)
            {
                return HandleInvalidModelStateSingleMessage();
            }
            var response = await _tripService.StartTrip(id, request);

            return Ok(new ApiResponse<TripResponse>(response));
        }

        [HttpPut("{id}/finish")]
        public async Task<IActionResult> FinishTrip(int id, [FromForm] UpdateTripRequest request)
        {
            if (!ModelState.IsValid)
            {
                return HandleInvalidModelStateSingleMessage();
            }
            var response = await _tripService.FinishTrip(id, request);

            return Ok(new ApiResponse<TripResponse>(response));
        }

        [HttpPost]
        public async Task<IActionResult> CreateTrip([FromBody]CreateTripRequest request)
        {
            if(!ModelState.IsValid){
                return HandleInvalidModelStateSingleMessage();
            }
            var response = await _tripService.CreateTrip(request);

            return Ok(new ApiResponse<TripResponse>(response));

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTrip(int id, [FromForm] UpdateTripRequest request)
        {
            if (!ModelState.IsValid) { return HandleInvalidModelStateSingleMessage(); }

            var response = await _tripService.UpdateTrip(id,request);

            return Ok(new ApiResponse<TripResponse>(response));
        }
        [HttpGet("{id}/pdf")]
        public async Task<IActionResult> GeneratePdf(int id)
        {
                

            var (fileName,pdfBytes) = await _tripService.GenerateTripPdfAsync(id);

            return File(pdfBytes, "application/pdf",fileName);
        }

        [HttpPut("{id}/archive")]
        public async Task<IActionResult> ArchiveTrip(int id)
        {
            var response = await _tripService.ArchiveTrip(id);
            return Ok(new ApiResponse<bool>(response));
        }

        [HttpPut("{id}/unarchive")]
        public async Task<IActionResult> UnarchiveTrip(int id)
        {
            var response = await _tripService.UnarchiveTrip(id);
            return Ok(new ApiResponse<bool>(response));
        }

        [HttpGet("archived")]
        public async Task<IActionResult> getArchived()
        {
            var response = await _tripService.getArchived();
            return Ok(new ApiResponse<List<TripResponse>>(response));
        }

    }
}
