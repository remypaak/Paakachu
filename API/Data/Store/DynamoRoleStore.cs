using System;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using Microsoft.AspNetCore.Identity;

namespace API.Data.Store;

public class DynamoRoleStore : IRoleStore<IdentityRole>
{
    private readonly IAmazonDynamoDB _dynamoDb;
    private const string TableName = "PaakachuTest";

    public DynamoRoleStore(IAmazonDynamoDB dynamoDb)
    {
        _dynamoDb = dynamoDb;
    }

    public async Task<IdentityResult> CreateAsync(IdentityRole role, CancellationToken cancellationToken)
    {
        var item = new Dictionary<string, AttributeValue>
        {
            { "primarykey", new AttributeValue { S = "ROLE#" + role.Id } },
            { "sortkey", new AttributeValue { S = "ROLE#" + role.Name } },
            { "EntityType", new AttributeValue { S = "Role" } },
            { "RoleName", new AttributeValue { S = role.Name ?? string.Empty } },
            { "NormalizedRoleName", new AttributeValue { S = role.NormalizedName ?? string.Empty } }
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
            Console.WriteLine($"Error creating role in DynamoDB: {ex.Message}");
            return IdentityResult.Failed(new IdentityError { Description = "Could not insert role into DynamoDB." });
        }
    }

    public async Task<IdentityResult> DeleteAsync(IdentityRole role, CancellationToken cancellationToken)
    {
        var request = new DeleteItemRequest
        {
            TableName = TableName,
            Key = new Dictionary<string, AttributeValue>
            {
                { "primarykey", new AttributeValue { S = "ROLE#" + role.Id } },
                { "sortkey", new AttributeValue { S = "ROLE#" + role.Name } }
            }
        };

        try
        {
            await _dynamoDb.DeleteItemAsync(request, cancellationToken);
            return IdentityResult.Success;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error deleting role in DynamoDB: {ex.Message}");
            return IdentityResult.Failed(new IdentityError { Description = "Could not delete role from DynamoDB." });
        }
    }

    public async Task<IdentityRole?> FindByIdAsync(string roleId, CancellationToken cancellationToken)
    {
        var request = new GetItemRequest
        {
            TableName = TableName,
            Key = new Dictionary<string, AttributeValue>
            {
                { "primarykey", new AttributeValue { S = "ROLE#" + roleId } }
            }
        };

        try
        {
            var response = await _dynamoDb.GetItemAsync(request, cancellationToken);

            if (response.Item == null || response.Item.Count == 0)
            {
                return null;
            }

            return new IdentityRole
            {
                Id = roleId,
                Name = response.Item["RoleName"].S,
                NormalizedName = response.Item["NormalizedRoleName"].S
            };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error finding role by ID in DynamoDB: {ex.Message}");
            return null;
        }
    }

    public async Task<IdentityRole?> FindByNameAsync(string normalizedRoleName, CancellationToken cancellationToken)
    {
        var scanRequest = new ScanRequest
        {
            TableName = TableName,
            FilterExpression = "NormalizedRoleName = :v_NormalizedRoleName AND begins_with(sortkey, :v_SortKey)",
            ExpressionAttributeValues = new Dictionary<string, AttributeValue>
        {
            { ":v_NormalizedRoleName", new AttributeValue { S = normalizedRoleName } },
            { ":v_SortKey", new AttributeValue { S = "ROLE#" } }
        }
        };

        try
        {
            var response = await _dynamoDb.ScanAsync(scanRequest, cancellationToken);
            var item = response.Items.FirstOrDefault();

            if (item == null || item.Count == 0)
            {
                return null;
            }

            return new IdentityRole
            {
                Id = item["primarykey"].S,
                Name = item["RoleName"].S,
                NormalizedName = item["NormalizedRoleName"].S
            };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error finding role by name in DynamoDB: {ex.Message}");
            return null;
        }
    }

    public async Task<IdentityResult> UpdateAsync(IdentityRole role, CancellationToken cancellationToken)
    {
        var request = new UpdateItemRequest
        {
            TableName = TableName,
            Key = new Dictionary<string, AttributeValue>
            {
                { "primarykey", new AttributeValue { S = "ROLE#" + role.Id } },
                { "sortkey", new AttributeValue { S = "ROLE#" + role.Name } }
            },
            AttributeUpdates = new Dictionary<string, AttributeValueUpdate>
            {
                { "RoleName", new AttributeValueUpdate { Action = "PUT", Value = new AttributeValue { S = role.Name ?? string.Empty } } },
                { "NormalizedRoleName", new AttributeValueUpdate { Action = "PUT", Value = new AttributeValue { S = role.NormalizedName ?? string.Empty } } }
            }
        };

        try
        {
            await _dynamoDb.UpdateItemAsync(request, cancellationToken);
            return IdentityResult.Success;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error updating role in DynamoDB: {ex.Message}");
            return IdentityResult.Failed(new IdentityError { Description = "Could not update role in DynamoDB." });
        }
    }

    public Task<string> GetRoleIdAsync(IdentityRole role, CancellationToken cancellationToken)
    {
        return Task.FromResult(role.Id);
    }

    public Task<string?> GetRoleNameAsync(IdentityRole role, CancellationToken cancellationToken)
    {
        return Task.FromResult(role.Name);
    }

    public Task SetRoleNameAsync(IdentityRole role, string? roleName, CancellationToken cancellationToken)
    {
        role.Name = roleName;
        return Task.CompletedTask;
    }

    public Task<string?> GetNormalizedRoleNameAsync(IdentityRole role, CancellationToken cancellationToken)
    {
        return Task.FromResult(role.NormalizedName);
    }

    public Task SetNormalizedRoleNameAsync(IdentityRole role, string? normalizedName, CancellationToken cancellationToken)
    {
        role.NormalizedName = normalizedName;
        return Task.CompletedTask;
    }

    public void Dispose()
    {
        // Cleanup if needed
    }
}
