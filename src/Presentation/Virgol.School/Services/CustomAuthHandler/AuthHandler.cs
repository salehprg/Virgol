using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Filters;
using Models;
using Models.User;

public class AuthHandler : AuthorizationHandler<TokenRequirement>
{

    private readonly AppDbContext appDbContext;
    UserService userService;

    public AuthHandler(AppDbContext applicationDbContext , UserManager<UserModel> userManager)
    {
        appDbContext = applicationDbContext;
        userService = new UserService(userManager , appDbContext);
    }

    public override Task HandleAsync(AuthorizationHandlerContext context)
    {
        return base.HandleAsync(context);
    }

    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, TokenRequirement requirement)
    {
        if (context.Resource is AuthorizationFilterContext mvcContext)
        {
            context.Succeed(requirement);
        }
        
        return Task.CompletedTask;
    }
}