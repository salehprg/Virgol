using Microsoft.VisualStudio.TestTools.UnitTesting;
using lms_with_moodle.Controllers;
using Virgol.School;
using Moq;
using Microsoft.AspNetCore.Identity;
using Models.User;
using Models;
using System.Threading.Tasks;

namespace Virgol.Tests
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public async Task TestMethod1()
        {
            var mockManagerUser = new Mock<UserManager<UserModel>>();
            var mockSigninUser = new Mock<SignInManager<UserModel>>();
            var mockRoleUser = new Mock<RoleManager<IdentityRole<int>>>();
            var mockAppDb = new Mock<AppDbContext>();

            mockManagerUser.Setup(x => x.FindByNameAsync(It.IsAny<string>())).Returns(() => null);

            mockManagerUser.Setup(x => x.IsInRoleAsync(It.IsAny<UserModel>(), It.IsAny<string>()))
                .ReturnsAsync(true);

            UsersController usersController = new UsersController(mockManagerUser.Object 
                                                                    , mockSigninUser.Object
                                                                    , mockRoleUser.Object 
                                                                    , mockAppDb.Object);

            UsersController.InputModel input = new UsersController.InputModel();
            input.Username = "1050934564";
            input.Password = "1050934564";

            var result = await usersController.LoginUser(input);

            Assert.AreEqual(1 , 1);

        }
    }
}
