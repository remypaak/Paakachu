using Amazon.DynamoDBv2;
using Amazon.Runtime;
using API.Data.Store;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using API.Services;
using API.Interfaces;

var builder = WebApplication.CreateBuilder(args);

var awsOptions = builder.Configuration.GetAWSOptions();
builder.Services.AddDefaultAWSOptions(awsOptions);
builder.Services.AddAWSService<IAmazonDynamoDB>();

builder.Services.AddControllers();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddDataProtection();

builder.Services.AddIdentityApiEndpoints<IdentityUser>()
                .AddRoles<IdentityRole>()
                .AddUserStore<DynamoUserStore>()
                .AddRoleStore<DynamoRoleStore>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = false,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["TokenKey"]))


                    };
                });
                
builder.Services.AddAuthorizationBuilder()
                .AddPolicy("RequireModeratorRole", policy => policy.RequireRole("MODERATOR"));

builder.Services.AddCors(options => {
    options.AddPolicy(name: "AllowOrigin", builder => {
        builder.WithOrigins("http://localhost:4200").AllowAnyHeader().AllowAnyMethod().AllowCredentials();
    });
});

var app = builder.Build();


app.UseCors("AllowOrigin");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
// app.MapIdentityApi<IdentityUser>();
app.Run();

