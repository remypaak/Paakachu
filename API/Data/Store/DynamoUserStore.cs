using System;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using Microsoft.AspNetCore.Identity;

namespace API.Data.Store;

public class DynamoUserStore(IAmazonDynamoDB dynamoDb) : IUserStore<IdentityUser>, IUserPasswordStore<IdentityUser>, IUserRoleStore<IdentityUser>
{
    private readonly IAmazonDynamoDB _dynamoDb = dynamoDb;
    private bool _disposed = false;
    private const string TableName = "PaakachuTest";

    public async Task<IdentityResult> CreateAsync(IdentityUser user, CancellationToken cancellationToken)
    {
        var item = new Dictionary<string, AttributeValue>
        {
            { "primarykey", new AttributeValue { S = "USER#" + user.Id } },
            { "sortkey", new AttributeValue { S = "USER#" } },
            { "EntityType", new AttributeValue { S = "User" } },
            { "UserName", new AttributeValue { S = user.UserName ?? string.Empty } },
            { "NormalizedUserName", new AttributeValue { S = user.NormalizedUserName ?? string.Empty } },
            { "Email", new AttributeValue { S = user.Email ?? string.Empty } },
            { "NormalizedEmail", new AttributeValue { S = user.NormalizedEmail ?? string.Empty } },
            { "PasswordHash", new AttributeValue { S = user.PasswordHash ?? string.Empty } },
            { "SecurityStamp", new AttributeValue { S = user.SecurityStamp ?? string.Empty } },
            { "ConcurrencyStamp", new AttributeValue { S = user.ConcurrencyStamp ?? string.Empty } }
        };

        var request = new PutItemRequest
        {
            TableName = TableName,
            Item = item
        };

        try
        {
            await _dynamoDb.PutItemAsync(request, cancellationToken);
            return IdentityResult.Success;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error saving user to DynamoDB: {ex.Message}");
            return IdentityResult.Failed(new IdentityError { Description = "Could not insert user into DynamoDB." });
        }
    }

    public async Task<IdentityResult> DeleteAsync(IdentityUser user, CancellationToken cancellationToken)
    {
        var request = new DeleteItemRequest
        {
            TableName = TableName,
            Key = new Dictionary<string, AttributeValue>
        {
            { "primarykey", new AttributeValue { S = "USER#" + user.Id } },
            { "sortkey", new AttributeValue { S = "USER#" } }
        }
        };

        try
        {
            await _dynamoDb.DeleteItemAsync(request, cancellationToken);
            return IdentityResult.Success;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error deleting user from DynamoDB: {ex.Message}");
            return IdentityResult.Failed(new IdentityError { Description = "Could not delete user from DynamoDB." });
        }
    }

    public async Task<IdentityUser?> FindByIdAsync(string userId, CancellationToken cancellationToken)
    {
        var request = new GetItemRequest
        {
            TableName = TableName,
            Key = new Dictionary<string, AttributeValue>
        {
            { "primarykey", new AttributeValue { S = "USER#" + userId } },
            { "sortkey", new AttributeValue { S = "USER#" } }
        }
        };

        try
        {
            var response = await _dynamoDb.GetItemAsync(request, cancellationToken);
            if (response.Item == null || response.Item.Count == 0)
            {
                return null;
            }

            var user = new IdentityUser
            {
                Id = userId,
                UserName = response.Item.TryGetValue("Username", out AttributeValue? value) ? value.S : null,
                NormalizedUserName = response.Item.TryGetValue("NormalizedUserName", out AttributeValue? valueNUName) ? valueNUName.S : null,
                Email = response.Item.TryGetValue("Email", out AttributeValue? valueEmail) ? valueEmail.S : null,
                NormalizedEmail = response.Item.TryGetValue("NormalizedEmail", out AttributeValue? valueNEmail) ? valueNEmail.S : null,
                PasswordHash = response.Item.TryGetValue("PasswordHash", out AttributeValue? valuePHash) ? valuePHash.S : null,
                SecurityStamp = response.Item.TryGetValue("SecurityStamp", out AttributeValue? valueSStamp) ? valueSStamp.S : null,
                ConcurrencyStamp = response.Item.TryGetValue("ConcurrencyStamp", out AttributeValue? valueCStamp) ? valueCStamp.S : null
            };

            return user;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error finding user by ID in DynamoDB: {ex.Message}");
            return null;
        }
    }

    public async Task<IdentityUser?> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken)
    {
        var request = new ScanRequest
        {
            TableName = TableName,
            FilterExpression = "NormalizedUserName = :v_NormalizedUserName AND sortkey = :v_SortKey",
            ExpressionAttributeValues = new Dictionary<string, AttributeValue>
        {
            { ":v_NormalizedUserName", new AttributeValue { S = normalizedUserName } },
            { ":v_SortKey", new AttributeValue { S = "USER#" } }
        }
        };

        try
        {
            var response = await _dynamoDb.ScanAsync(request, cancellationToken);
            var item = response.Items.FirstOrDefault();

            if (item == null || item.Count == 0)
            {
                return null;
            }

            var user = new IdentityUser
            {
                Id = item["primarykey"].S.Replace("USER#", ""),
                UserName = item.TryGetValue("UserName", out AttributeValue? value) ? value.S : null,
                NormalizedUserName = item.TryGetValue("NormalizedUserName", out AttributeValue? valueNUName) ? valueNUName.S : null,
                Email = item.TryGetValue("Email", out AttributeValue? valueEmail) ? valueEmail.S : null,
                NormalizedEmail = item.TryGetValue("NormalizedEmail", out AttributeValue? valueNEmail) ? valueNEmail.S : null,
                PasswordHash = item.TryGetValue("PasswordHash", out AttributeValue? valuePHash) ? valuePHash.S : null,
                SecurityStamp = item.TryGetValue("SecurityStamp", out AttributeValue? valueSStamp) ? valueSStamp.S : null,
                ConcurrencyStamp = item.TryGetValue("ConcurrencyStamp", out AttributeValue? valueCStamp) ? valueCStamp.S : null
            };

            return user;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error finding user by name in DynamoDB: {ex.Message}");
            return null;
        }
    }

    public async Task<IdentityResult> UpdateAsync(IdentityUser user, CancellationToken cancellationToken)
    {
        var request = new UpdateItemRequest
        {
            TableName = TableName,
            Key = new Dictionary<string, AttributeValue>
        {
            { "primarykey", new AttributeValue { S = "USER#" + user.Id } },
            { "sortkey", new AttributeValue { S = "USER#" } }
        },
            AttributeUpdates = new Dictionary<string, AttributeValueUpdate>
        {
            { "UserName", new AttributeValueUpdate { Action = "PUT", Value = new AttributeValue { S = user.UserName } } },
            { "NormalizedUserName", new AttributeValueUpdate { Action = "PUT", Value = new AttributeValue { S = user.NormalizedUserName } } },
            { "Email", new AttributeValueUpdate { Action = "PUT", Value = new AttributeValue { S = user.Email } } },
            { "NormalizedEmail", new AttributeValueUpdate { Action = "PUT", Value = new AttributeValue { S = user.NormalizedEmail } } },
            { "PasswordHash", new AttributeValueUpdate { Action = "PUT", Value = new AttributeValue { S = user.PasswordHash } } },
            { "SecurityStamp", new AttributeValueUpdate { Action = "PUT", Value = new AttributeValue { S = user.SecurityStamp } } },
            { "ConcurrencyStamp", new AttributeValueUpdate { Action = "PUT", Value = new AttributeValue { S = user.ConcurrencyStamp } } }
        }
        };

        try
        {
            await _dynamoDb.UpdateItemAsync(request, cancellationToken);
            return IdentityResult.Success;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error updating user in DynamoDB: {ex.Message}");
            return IdentityResult.Failed(new IdentityError { Description = "Could not update user in DynamoDB." });
        }
    }

    public void Dispose()
    {

    }

    public Task SetPasswordHashAsync(IdentityUser user, string? passwordHash, CancellationToken cancellationToken)
    {
        user.PasswordHash = passwordHash;
        return Task.CompletedTask;
    }

    public Task<string?> GetPasswordHashAsync(IdentityUser user, CancellationToken cancellationToken)
    {
        return Task.FromResult(user.PasswordHash);
    }

    public Task<bool> HasPasswordAsync(IdentityUser user, CancellationToken cancellationToken)
    {
        return Task.FromResult(!string.IsNullOrEmpty(user.PasswordHash));
    }

    public Task<string> GetUserIdAsync(IdentityUser user, CancellationToken cancellationToken)
    {
        return Task.FromResult(user.Id);
    }

    public Task<string?> GetUserNameAsync(IdentityUser user, CancellationToken cancellationToken)
    {
        return Task.FromResult(user.UserName);
    }

    public Task SetUserNameAsync(IdentityUser user, string? userName, CancellationToken cancellationToken)
    {
        user.UserName = userName;
        return Task.CompletedTask;
    }

    public Task<string?> GetNormalizedUserNameAsync(IdentityUser user, CancellationToken cancellationToken)
    {
        return Task.FromResult(user.NormalizedUserName);
    }

    public Task SetNormalizedUserNameAsync(IdentityUser user, string? normalizedName, CancellationToken cancellationToken)
    {
        user.NormalizedUserName = normalizedName;
        return Task.CompletedTask;
    }

    public async Task AddToRoleAsync(IdentityUser user, string roleName, CancellationToken cancellationToken)
    {
        var item = new Dictionary<string, AttributeValue>
    {
        { "primarykey", new AttributeValue { S = "USER#" + user.Id } },
        { "sortkey", new AttributeValue { S = $"ROLE#{roleName}" } },
        { "EntityType", new AttributeValue { S = "UserRole" } },
        { "RoleName", new AttributeValue { S = roleName } },
    };

        var request = new PutItemRequest
        {
            TableName = TableName,
            Item = item
        };

        await _dynamoDb.PutItemAsync(request, cancellationToken);
    }

    public async Task RemoveFromRoleAsync(IdentityUser user, string roleName, CancellationToken cancellationToken)
    {
        var key = new Dictionary<string, AttributeValue>
    {
        { "primarykey", new AttributeValue { S = "USER#" + user.Id } },
        { "sortkey", new AttributeValue { S = $"ROLE#{roleName}" } }
    };

        var request = new DeleteItemRequest
        {
            TableName = TableName,
            Key = key
        };

        await _dynamoDb.DeleteItemAsync(request, cancellationToken);
    }

    public async Task<IList<string>> GetRolesAsync(IdentityUser user, CancellationToken cancellationToken)
    {
        var queryRequest = new QueryRequest
        {
            TableName = TableName,
            KeyConditionExpression = "primarykey = :v_UserId and begins_with(sortkey, :v_RolePrefix)",
            ExpressionAttributeValues = new Dictionary<string, AttributeValue>
        {
            { ":v_UserId", new AttributeValue { S = "USER#" + user.Id } },
            { ":v_RolePrefix", new AttributeValue { S = "ROLE#" } }
        }
        };

        var response = await _dynamoDb.QueryAsync(queryRequest, cancellationToken);

        var roles = response.Items.Select(item => item["RoleName"].S).ToList();
        return roles;
    }

    public async Task<bool> IsInRoleAsync(IdentityUser user, string roleName, CancellationToken cancellationToken)
    {
        var queryRequest = new QueryRequest
        {
            TableName = TableName,
            KeyConditionExpression = "primarykey = :v_UserId and sortkey = :v_Role",
            ExpressionAttributeValues = new Dictionary<string, AttributeValue>
            {
                { ":v_UserId", new AttributeValue { S = "USER#" + user.Id } },
                { ":v_Role", new AttributeValue { S = $"ROLE#{roleName}" } }
            },
            Limit = 1
        };

        var response = await _dynamoDb.QueryAsync(queryRequest, cancellationToken);
        return response.Items.Count > 0;
    }

    public async Task<IList<IdentityUser>> GetUsersInRoleAsync(string roleName, CancellationToken cancellationToken)
    {
        var scanRequest = new ScanRequest
        {
            TableName = TableName, 
            FilterExpression = "begins_with(sortkey, :v_Role)",
            ExpressionAttributeValues = new Dictionary<string, AttributeValue>
            {
                { ":v_Role", new AttributeValue { S = $"ROLE#{roleName}" } }
            }
        };

        var response = await _dynamoDb.ScanAsync(scanRequest, cancellationToken);

        var users = new List<IdentityUser>();

        foreach (var item in response.Items)
        {
            var user = new IdentityUser
            {
                Id = item["primarykey"].S.Replace("USER#", ""),  
                UserName = item.TryGetValue("UserName", out AttributeValue? value) ? value.S : null,
                Email = item.TryGetValue("Email", out AttributeValue? valueEmail) ? valueEmail.S : null
            };

            users.Add(user);
        }

        return users;
    }
}
