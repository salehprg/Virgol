using System.Linq;
using System.Threading.Tasks;
using lms_with_moodle.Helper;
using Microsoft.AspNetCore.Identity;
using Models;
using Models.User;
///<summary>
///use this to Operate User in all Database in moodle , LDAP , SQL
///</summary>
public class MyUserManager {
    UserManager<UserModel> userManager;
    AppDbContext appDbContext;
    MoodleApi moodleApi;
    LDAP_db ldap;

    public MyUserManager(UserManager<UserModel> _userManager , AppSettings appSettings , AppDbContext _appDbContext = null)
    {
        userManager = _userManager;
        appDbContext = _appDbContext;
        moodleApi = new MoodleApi(appSettings);
        ldap = new LDAP_db(appSettings , null);
    }
    public bool CreateUser()
    {
        bool result = false;

        return result;
    }
    public bool EditUser()
    {
        bool result = false;

        return result;
    }
    public async Task<bool> DeleteUser(UserModel user)
    {
        try
        {
            if(ldap.DeleteEntry(user.MelliCode))
                await moodleApi.DeleteUser(user.Moodle_Id);

            await userManager.RemoveFromRoleAsync(user , "User");
            await userManager.RemoveFromRoleAsync(user , "Teacher");
            await userManager.RemoveFromRoleAsync(user , "Admin");
            await userManager.RemoveFromRoleAsync(user , "Manager");
            await userManager.DeleteAsync(user);
            
            if(user.userTypeId == (int)UserType.Manager)
            {
                appDbContext.News.RemoveRange(appDbContext.News.Where(x => x.AutherId == user.Id).ToList());
                appDbContext.ManagerDetails.Remove(appDbContext.ManagerDetails.Where(x => x.UserId == user.Id).FirstOrDefault());

                appDbContext.SaveChanges();
            }

            return true;
        }
        catch
        {
            return false;
        }
    }

    public bool CheckPhoneInterupt(string phoneNumber)
    {
        if(phoneNumber != "")
        {
            UserModel oldPhone = appDbContext.Users.Where(x => x.PhoneNumber.Contains(phoneNumber.ToString())).FirstOrDefault();

            if(oldPhone != null)
                return true;

            StudentDetail studentDetail = appDbContext.StudentDetails.Where(x => x.FatherPhoneNumber.Contains(phoneNumber.ToString())).FirstOrDefault();
            if(studentDetail != null)
                return true;
        }

        return false;

    }

    public bool CheckMelliCodeInterupt(string melliCode , int userId)
    {

        UserModel oldUser = appDbContext.Users.Where(x => x.MelliCode == melliCode).FirstOrDefault();

        if(oldUser != null && oldUser.Id != userId)
        {
            return true;
        }

        return false;

    }


}