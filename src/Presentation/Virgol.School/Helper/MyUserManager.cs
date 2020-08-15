using System.Threading.Tasks;
using lms_with_moodle.Helper;
using Microsoft.AspNetCore.Identity;
using Models.User;
///<summary>
///use this to Operate User in all Database in moodle , LDAP , SQL
///</summary>
public class MyUserManager {
    UserManager<UserModel> userManager;
    MoodleApi moodleApi;
    LDAP_db ldap;

    public MyUserManager(UserManager<UserModel> _userManager , AppSettings appSettings)
    {
        userManager = _userManager;

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

            return true;
        }
        catch
        {
            return false;
        }
    }
}