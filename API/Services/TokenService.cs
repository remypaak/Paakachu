using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
namespace API.Services;

public class TokenService(UserManager<IdentityUser> userManager, IConfiguration config) : ITokenService
{
    public async Task<string> CreateToken(IdentityUser user)
    {
        if (user.UserName == null) throw new Exception("No username for user");

        var claims = new List<Claim>{
            new (ClaimTypes.NameIdentifier, user.Id.ToString()),
            new (ClaimTypes.Name, user.UserName)

        };

        var roles = await userManager.GetRolesAsync(user);

        foreach(var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        };
        var tokenKey = config["TokenKey"] ?? throw new Exception("Cannot access tokenkey from appsettings");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(1),
            SigningCredentials = creds

        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }
}
