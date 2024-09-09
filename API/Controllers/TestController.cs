using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class TestController : BaseAPIController
    {
        [Authorize]
        [HttpGet("auth-check")]
        public IActionResult AuthCheck()
        {
            return Ok(new { message = "You are authenticated!" });
        }

        [Authorize(Policy = "RequireModeratorRole")]
        [HttpGet("moderator-check")]
        public IActionResult ModeratorCheck()
        {
            return Ok(new { message = "You are a moderator!" });
        }
    }
}
