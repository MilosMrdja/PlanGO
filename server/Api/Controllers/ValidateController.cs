using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    public class ValidateController : ControllerBase
    {
        protected IActionResult HandleInvalidModelStateSingleMessage()
        {
            var firstErrorMessage = ModelState
                .SelectMany(kvp => kvp.Value.Errors)
                .Select(e => e.ErrorMessage)
                .FirstOrDefault() ?? "Validation error";
           
            return BadRequest(new
            {
                status = "error",
                message = firstErrorMessage
            });
        }
    }
}
