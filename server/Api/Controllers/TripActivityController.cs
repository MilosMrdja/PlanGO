using Application.DTOs;
using Application.Services;
using Application.utils;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/trip-activities")]
    [ApiController]
    [Authorize]
    public class TripActivityController : ValidateController
    {
        private readonly TripActivityService _tripActivityService;

        public TripActivityController(TripActivityService tripActivityService)
        {
            _tripActivityService = tripActivityService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var response = await _tripActivityService.GetById(id);
            if (response == null) { return NoContent(); };
            return Ok(new ApiResponse<TripActivityResponse>(response));
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int tripId)
        {
            var response = await _tripActivityService.GetAllByTrip(tripId);
            return Ok(new ApiResponse<List<TripActivityResponse>>(response));
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TripActivityRequest request)
        {
            if (!ModelState.IsValid)
            {
                return HandleInvalidModelStateSingleMessage();
            }
            var response = await _tripActivityService.Create(request);
            return Ok(new ApiResponse<TripActivityResponse>(response));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] TripActivityRequest request)
        {
            
            var response = await _tripActivityService.Update(id,request);
            return Ok(new ApiResponse<TripActivityResponse>(response));
        }
        [HttpPut("{id}/start")]
        public async Task<IActionResult> StartActivity(int id, [FromForm] TripActivityRequest request)
        {
            
            var response = await _tripActivityService.StartActivity(id, request);
            return Ok(new ApiResponse<TripActivityResponse>(response));
        }

        [HttpPut("{id}/finish")]
        public async Task<IActionResult> FinishActivity(int id, [FromForm] TripActivityRequest request)
        {
            
            var response = await _tripActivityService.FinishActivity(id, request);
            return Ok(new ApiResponse<TripActivityResponse>(response));
        }

        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelActivity(int id, [FromBody] TripActivityRequest request)
        {
            
            var response = await _tripActivityService.CancelActivity(id, request);
            return Ok(new ApiResponse<TripActivityResponse>(response));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
          
             await _tripActivityService.Delete(id);
            return NoContent();
        }
    }

}
