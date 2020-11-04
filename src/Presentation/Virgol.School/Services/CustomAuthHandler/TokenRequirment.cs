using Microsoft.AspNetCore.Authorization;

public class TokenRequirement : IAuthorizationRequirement
{
    public string Permission { get; private set; }

    public TokenRequirement(string permission)
    {
        Permission = permission;
    }
}