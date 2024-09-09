using API.Interfaces;
using API.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using API.Extensions;

namespace API.Controllers
{
    public class UserController(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager,
                                SignInManager<IdentityUser> signInManager, ITokenService tokenService) : BaseAPIController
    {
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register([FromBody] RegisterDto model)
        {
            var user = new IdentityUser
            {
                UserName = model.UserName,
                Email = model.Email
            };

            var result = await userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                return new UserDto 
                {
                    UserName = user.UserName,
                    Token = await tokenService.CreateToken(user)
                };
            }

            return BadRequest(result.Errors);
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login([FromBody] LoginDto model)
        {
            var user = await userManager.FindByNameAsync(model.UserName);
            if (user == null || user.UserName == null)
            {
                return BadRequest("De combinatie van gebruikersnaam en wachtwoord is onbekend");
            }

            var result = await signInManager.CheckPasswordSignInAsync(user, model.Password, false);

            if (!result.Succeeded)
            {
                return BadRequest("De combinatie van gebruikersnaam en wachtwoord is onbekend");
            }

            return new UserDto
            {
                UserName = user.UserName,
                Token = await tokenService.CreateToken(user)
            };
        }


        [HttpPost("assign-role")]
        public async Task<ActionResult> AssignRole([FromBody] AssignRoleDto assignRoleDto)
        {
            if (string.IsNullOrEmpty(assignRoleDto.Role)) return BadRequest("You must select at least one role");

            var user = await userManager.FindByNameAsync(assignRoleDto.Username);

            if (user == null) return BadRequest("User not found");

            var normalizedRoleName = assignRoleDto.Role.ToUpper();
            var roleExists = await roleManager.RoleExistsAsync(normalizedRoleName);
            if (!roleExists)
            {
                var roleResult = await roleManager.CreateAsync(new IdentityRole(normalizedRoleName));
                if (!roleResult.Succeeded) return BadRequest("Failed to create role");
            }
            var userRoles = await userManager.GetRolesAsync(user);
            if (userRoles.Contains(normalizedRoleName))
            {
                return BadRequest(new { message = "User already has the role" });
            }

            var result = await userManager.AddToRoleAsync(user, normalizedRoleName);
            if (!result.Succeeded)
            {
                return BadRequest(new { message = "Failed to add role", errors = result.Errors });
            }

            return Ok(await userManager.GetRolesAsync(user));
        }

    [HttpPost("change-password")]
    public async Task<ActionResult<UserDto>> ChangePassword([FromBody] changePasswordDto changePasswordDto)
    {
        var user = await userManager.FindByNameAsync(User.GetUserName());

        if (user == null)
        {
            return BadRequest(new {message = "User can't be found"});
        }

        if (changePasswordDto.CurrentPassword == changePasswordDto.NewPassword)
        {
            return BadRequest( new { message = "New password can't be the same as the old password"});
        }

        var result = await userManager.ChangePasswordAsync(user, changePasswordDto.CurrentPassword, changePasswordDto.NewPassword);

        if (!result.Succeeded)
        {
            return BadRequest(new { message = "Something went wrong while changing your password"});
        }

        return new UserDto {
            UserName = user.UserName!,
    	    Token = await tokenService.CreateToken(user)
        };
    }
}
}
