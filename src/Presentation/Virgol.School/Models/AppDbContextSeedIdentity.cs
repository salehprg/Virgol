using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using Models;
using Models.User;
using Models.Users.Roles;

public static class AppDbContextSeedIdentity {
    public static void SeedUser(UserManager<UserModel> userManager , RoleManager<IdentityRole<int>> roleManager , AppDbContext appDbContext)
    {
        List<IdentityRole<int>> roles = new List<IdentityRole<int>>{
            new IdentityRole<int>{
                Id = 1,
                Name = Models.Users.Roles.Roles.Admin,
                NormalizedName = Models.Users.Roles.Roles.Admin.ToUpper()
            },
            new IdentityRole<int>{
                Id = 2,
                Name = Models.Users.Roles.Roles.Manager,
                NormalizedName = Models.Users.Roles.Roles.Manager.ToUpper()
            },
            new IdentityRole<int>{
                Id = 3,
                Name = Models.Users.Roles.Roles.CoManager,
                NormalizedName = Models.Users.Roles.Roles.CoManager.ToUpper()
            },
            new IdentityRole<int>{
                Id = 4,
                Name = Models.Users.Roles.Roles.Teacher,
                NormalizedName = Models.Users.Roles.Roles.Teacher.ToUpper()
            },
            new IdentityRole<int>{
                Id = 5,
                Name = Models.Users.Roles.Roles.Student,
                NormalizedName = Models.Users.Roles.Roles.Student.ToUpper()
            },
            new IdentityRole<int>{
                Id = 6,
                Name = Models.Users.Roles.Roles.api,
                NormalizedName = Models.Users.Roles.Roles.api.ToUpper()
            },
            new IdentityRole<int>{
                Id = 7,
                Name = Models.Users.Roles.Roles.User,
                NormalizedName = Models.Users.Roles.Roles.User.ToUpper()
            },
            new IdentityRole<int>{
                Id = 8,
                Name = Models.Users.Roles.Roles.Administrator,
                NormalizedName = Models.Users.Roles.Roles.Administrator.ToUpper()
            }
        };

        foreach (var role in roles)
        {
            if(roleManager.FindByNameAsync(role.Name).Result == null)
            {
                roleManager.CreateAsync(role).Wait();
            }
        }
        
        UserModel Administrator = new UserModel{
                                    UserName = "admin",
                                    FirstName = "Admin",
                                    LastName = "Virgol",
                                    ConfirmedAcc = true,
                                    LatinFirstname = "admin",
                                    LatinLastname = "virgol",
                                    MelliCode = "admin",
                                };

        UserModel testAdmin = new UserModel{
                                UserName = "AdminTest",
                                FirstName = "مدیرکل",
                                LastName = "تست",
                                ConfirmedAcc = true,
                                LatinFirstname = "modirkol",
                                LatinLastname = "test",
                                MelliCode = "AdminTest",
                            };

        UserModel admin = userManager.FindByNameAsync("AdminTest").Result;

        if(admin == null)
        {
            userManager.CreateAsync(testAdmin , "1234567890").Wait();
            userManager.AddToRoleAsync(testAdmin , Roles.Admin).Wait();
            admin = testAdmin;
        }
        if(appDbContext.AdminDetails.Where(x => x.UserId == admin.Id).FirstOrDefault() == null)
        {
            AdminDetail adminDetail = new AdminDetail{
                                        SchoolLimit = 20,
                                        SchoolsType = 3,
                                        TypeName = "مدارس تست سامانه",
                                        UserId = admin.Id
                                    };

            appDbContext.AdminDetails.AddAsync(adminDetail);
            appDbContext.SaveChangesAsync().Wait();
        }
        if(userManager.FindByNameAsync("admin").Result == null)
        {
            userManager.CreateAsync(Administrator , "wydta4-voqvAb-vadpaf").Wait();
            userManager.AddToRoleAsync(Administrator , Roles.Administrator).Wait();
        }

        
    }
}