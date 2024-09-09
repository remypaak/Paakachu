using System;

namespace API.DTOs;

public class AssignRoleDto
{
    public required string Username { get; set; }
    public required string Role { get; set; }
}
