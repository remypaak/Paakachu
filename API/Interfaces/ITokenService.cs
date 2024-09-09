using Microsoft.AspNetCore.Identity;

namespace API.Interfaces;

public interface ITokenService
{
    Task<string> CreateToken(IdentityUser user);
}