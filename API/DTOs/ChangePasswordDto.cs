namespace API.DTOs;

public class changePasswordDto
{
    public required string CurrentPassword { get; set; }
    public required string NewPassword { get; set; }
}
