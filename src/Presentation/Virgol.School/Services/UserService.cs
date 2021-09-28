using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Virgol.Helper;
using Microsoft.AspNetCore.Identity;
using Models;
using Models.InputModel;
using Models.User;
using Newtonsoft.Json;
using Models.Users.Roles;



///<summary>
///use this to Operate User in all Database in moodle , LDAP , SQL
///</summary>
public class UserService {
    UserManager<UserModel> userManager;
    AppDbContext appDbContext;
    MoodleApi moodleApi;
    LDAP_db ldap;

    public UserService(UserManager<UserModel> _userManager , AppDbContext _appDbContext)
    {
        userManager = _userManager;
        appDbContext = _appDbContext;
        moodleApi = new MoodleApi(AppSettings.GetValueFromDatabase(appDbContext , "Token_moodle"));
        ldap = new LDAP_db(_appDbContext);
    }

    public UserModel GetUserModel (ClaimsPrincipal User)
    {
        try
        {
            string idNumber = userManager.GetUserId(User);
            UserModel userModel = appDbContext.Users.Where(x => x.MelliCode == idNumber).FirstOrDefault();

            if(userModel != null)
            {
                return userModel;
            }

            return null;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return null;
            
        }
    }
    public UserModel GetUserModel (string mellicode)
    {
        try
        {
            UserModel userModel = appDbContext.Users.Where(x => x.MelliCode == mellicode).FirstOrDefault();

            return userModel;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return null;
            
        }
    }

    ///<summary>
    ///Every user should have MelliCode property 
    ///</summary>
    public async Task<List<UserDataModel>> CreateUser(List<UserDataModel> users , List<string> userRoles , int schoolId , string password = null)
    {
        SchoolModel schoolModel = appDbContext.Schools.Where(x => x.Id == schoolId).FirstOrDefault();

        users = users.Where(x => x.MelliCode != null).ToList();

        List<UserDataModel> result = new List<UserDataModel>();

        foreach (var userData in users)
        {
            var serialized = JsonConvert.SerializeObject(userData);
            UserModel user = JsonConvert.DeserializeObject<UserModel>(serialized);
               
            if(schoolModel.AutoFill)
            {
                user.LatinFirstname = "ff";
                user.LatinLastname = "ll";
                user.Email = "ff.ll." + user.MelliCode.Substring(user.MelliCode.Length - 2 , 2);
            }

            bool melliCodeIterupt = CheckMelliCodeInterupt(user.MelliCode , 0);
            bool phoneInterupt = CheckPhoneInterupt(user.PhoneNumber);

            if(!phoneInterupt && !melliCodeIterupt && !string.IsNullOrEmpty(user.FirstName) && !string.IsNullOrEmpty(user.LastName))
            {
                int moodleId = 0;

                if(!userRoles.Contains(Roles.Teacher))
                {
                    user.SchoolId = schoolId;
                    userData.SchoolId = schoolId;
                }
                
                string _password = (!string.IsNullOrEmpty(password) ? password : user.MelliCode);
                if(!string.IsNullOrEmpty(user.password))
                    _password = user.password;

                if((await userManager.CreateAsync(user , _password)).Succeeded)
                {
                    userData.Id = user.Id;
                    await userManager.AddToRolesAsync(user , userRoles);

                    bool hasTeacherRole = false;

                    if(userRoles.Contains(Roles.Teacher))
                    {
                        hasTeacherRole = true;
                        await SyncUserDetail(userData , schoolId);
                    }
                    else
                    {
                        await SyncUserDetail(userData);
                    }
                    
                    userData.Id = user.Id;
                    bool ldapResult = await ldap.AddUserToLDAP(user , hasTeacherRole , _password);
                    //bool ldapResult = true;
                    if(ldapResult)
                    {
                        moodleId = await moodleApi.CreateUser(user);
                        //moodleId = 0;
                        if(moodleId != -1)
                        {
                            user.Moodle_Id = moodleId;

                            appDbContext.Users.Update(user);
                        }
                    }

                    result.Add(userData);
                }
            }
            
        }

        await appDbContext.SaveChangesAsync();

        return result;
    }

    ///<summary>
    ///Every user should have Id property 
    ///</summary>    
    public async Task<List<UserDataModel>> EditUsers(List<UserDataModel> users , int schoolId = 0 , bool assignTeacher = false , string newPassword = "")
    {
        List<UserDataModel> result = new List<UserDataModel>();

        foreach (var user in users)
        {
            UserModel oldData = appDbContext.Users.Where(x => x.Id == user.Id).FirstOrDefault();

            if(oldData.MelliCode != user.MelliCode)
            {
                await userManager.SetUserNameAsync(oldData , user.MelliCode);
                ldap.EditUserName(oldData.MelliCode , user.MelliCode);
            }

            if(!string.IsNullOrEmpty(newPassword))
            {
                string token = await userManager.GeneratePasswordResetTokenAsync(oldData);
                IdentityResult chngPassword = await userManager.ResetPasswordAsync(oldData , token , newPassword);
                if(chngPassword.Succeeded)
                {
                    ldap.ChangePassword(oldData.UserName , newPassword);
                }
            }

            ldap.EditAttribute(oldData.MelliCode , "sn" , user.LastName);
            ldap.EditAttribute(oldData.MelliCode , "givenName" , user.FirstName);
            
            if(!assignTeacher)
            {
                oldData.FirstName = user.FirstName;
                oldData.LastName = user.LastName;
                oldData.LatinFirstname = user.LatinFirstname;
                oldData.LatinLastname = user.LatinLastname;
                oldData.PhoneNumber = user.PhoneNumber;
                oldData.MelliCode = user.MelliCode;
                oldData.Sexuality = user.Sexuality;
            }

            appDbContext.Users.Update(oldData);
            await appDbContext.SaveChangesAsync();

            //user.UserType = oldData.UserType;

            if(user.LatinFirstname != null && user.LatinLastname != null)
                await ldap.EditMail(oldData);

            await SyncUserDetail(user , schoolId);

            result.Add(user);
        }
        
        
        
        return result;
    }
    public async Task<bool> DeleteUser(UserModel user)
    {
        try
        {
            if(ldap.DeleteEntry(user.MelliCode))
                await moodleApi.DeleteUser(user.Moodle_Id);

            await userManager.DeleteAsync(user);
            
            return true;
        }
        catch
        {
            return false;
        }
    }

#region Interupt
    public bool CheckPhoneInterupt(string phoneNumber)
    {
        // if(!string.IsNullOrEmpty(phoneNumber))
        // {
        //     UserModel oldPhone = appDbContext.Users.Where(x => x.PhoneNumber.Contains(phoneNumber.ToString())).FirstOrDefault();

        //     if(oldPhone != null)
        //         return true;

        //     StudentDetail studentDetail = appDbContext.StudentDetails.Where(x => x.FatherPhoneNumber.Contains(phoneNumber.ToString())).FirstOrDefault();
        //     if(studentDetail != null)
        //         return true;
        // }

        // return false;

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

#endregion

#region SyncData
    public async Task<List<UserModel>> SyncUserData(List<UserModel> users , bool moodle = false)
    {
        List<UserModel> updatedUser = new List<UserModel>();

        foreach (var user in users)
        {
            try
            {
                if(!ldap.CheckUserData(user.UserName) && !moodle)
                {
                    await ldap.AddUserToLDAP(user , false , user.MelliCode);
                    updatedUser.Add(user);
                }

                if(moodle)
                {
                    int moodleid = await moodleApi.GetUserId(user.MelliCode);
                    if(moodleid != -1 && user.Moodle_Id != moodleid)
                    {
                        user.Moodle_Id = moodleid;
                        updatedUser.Add(user);
                    }
                    else if(moodleid == -1)
                    {
                        moodleid = await moodleApi.CreateUser(user);
                        user.Moodle_Id = moodleid;
                        updatedUser.Add(user);
                    }
                }
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return null;
            }
        }

        if(moodle)
        {
            appDbContext.Users.UpdateRange(updatedUser);
            await appDbContext.SaveChangesAsync();
        }

       // appDbContext.Users.UpdateRange(users);
        //await appDbContext.SaveChangesAsync();

        return updatedUser;
        
    }

    public async Task<bool> SyncUserDetail(UserDataModel user , int teacherSchoolId = 0)
    {
        try
        {
            UserModel userModel = appDbContext.Users.Where(x => x.Id == user.Id).FirstOrDefault();
            string UserType = GetUserRoles(userModel).Result.Where(x => x != Roles.User).FirstOrDefault();

            switch(UserType)
            {
                case Roles.Student:
                    StudentDetail studentDetail = appDbContext.StudentDetails.Where(x => x.UserId == user.Id).FirstOrDefault();
                    if(studentDetail != null)
                    {
                        studentDetail.FatherName = user.studentDetail.FatherName;
                        studentDetail.MotherName = user.studentDetail.MotherName;
                        studentDetail.FatherMelliCode = user.studentDetail.FatherMelliCode;
                        studentDetail.FatherPhoneNumber = user.studentDetail.FatherPhoneNumber;

                        appDbContext.StudentDetails.Update(studentDetail);
                    }
                    else
                    {
                        studentDetail = user.studentDetail;
                        studentDetail.UserId = user.Id;
                        
                        await appDbContext.StudentDetails.AddAsync(studentDetail);
                    }

                    user.studentDetail = studentDetail;
                    break;

                case Roles.Teacher:
                    TeacherDetail teacherDetail = appDbContext.TeacherDetails.Where(x => x.TeacherId == user.Id).FirstOrDefault();
                    if(teacherDetail != null)
                    {
                        if(user.teacherDetail != null)
                        {
                            teacherDetail.personalIdNUmber = user.teacherDetail.personalIdNUmber;
                        }
                        
                        if(teacherSchoolId != 0 && !teacherDetail.SchoolsId.Contains(teacherSchoolId.ToString() + ','))
                        {
                            teacherDetail.SchoolsId += teacherSchoolId.ToString() + ',';
                        }
                        
                        appDbContext.TeacherDetails.Update(teacherDetail);
                    }
                    else
                    {
                        teacherDetail = new TeacherDetail();
                        if(user.teacherDetail != null)
                        {
                            teacherDetail.personalIdNUmber = user.teacherDetail.personalIdNUmber;
                        }
                        teacherDetail.TeacherId = user.Id;
                        teacherDetail.SchoolsId = teacherSchoolId + ",";

                        await appDbContext.TeacherDetails.AddAsync(teacherDetail);
                    }
                    user.teacherDetail = teacherDetail;
                    break;

                case Roles.Manager:
                    ManagerDetail managerDetail = appDbContext.ManagerDetails.Where(x => x.UserId == user.Id).FirstOrDefault();
                    if(managerDetail != null)
                    {
                        if(user.managerDetail != null)
                        {
                            managerDetail.personalIdNumber = user.managerDetail.personalIdNumber;
                        }
                        
                        appDbContext.ManagerDetails.Update(managerDetail);
                    }
                    else
                    {
                        managerDetail = new ManagerDetail();
                        if(user.managerDetail != null)
                        {
                            managerDetail.personalIdNumber = user.managerDetail.personalIdNumber;
                        }
                        managerDetail.UserId = user.Id;

                        await appDbContext.ManagerDetails.AddAsync(managerDetail);
                    }
                    user.managerDetail = managerDetail;
                    break;
            }
            
        
        }
        catch(Exception ex)
        {
            Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
            return false;
        }
        
        await appDbContext.SaveChangesAsync();

        return true;
        
    }

#endregion

#region Roles

    public async Task<bool> AddRole(UserModel userModel , string role)
    {
        try
        {
            await userManager.AddToRoleAsync(userModel , role);
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);

            return false;
        }
    }

    public bool HasRole(UserModel userModel , string RoleName , bool OnlyThisRole = false)
    {
        try
        {
            List<string> roles = GetUserRoles(userModel).Result;
            
            if(roles != null)
            {
                if(OnlyThisRole && roles.Count == 1)
                {
                    if(roles.FirstOrDefault() == RoleName)
                    {
                        return true;
                    }
                }
                else if(OnlyThisRole)
                {
                    return false;
                }

                if(!OnlyThisRole && !string.IsNullOrEmpty(roles.Where(x => x == RoleName).FirstOrDefault()))
                {
                    return true;
                }
            }

            return false;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return false;
        }
    }

    ///<summary>
    ///Use this function if you have User Roles List to Improve performance
    ///</summary>
    public bool HasRole(UserModel userModel , string RoleName , List<string> UserRoles , bool OnlyThisRole = false)
    {
        try
        {
            List<string> roles = UserRoles;
            
            if(roles != null)
            {
                if(OnlyThisRole && roles.Count == 1)
                {
                    if(roles.FirstOrDefault() == RoleName)
                    {
                        return true;
                    }
                }
                else if(OnlyThisRole)
                {
                    return false;
                }

                if(!OnlyThisRole && !string.IsNullOrEmpty(roles.Where(x => x == RoleName).FirstOrDefault()))
                {
                    return true;
                }
            }

            return false;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return false;
        }
    }

    public async Task<List<string>> GetUserRoles(UserModel userModel)
    {
        try
        {
            userModel = appDbContext.Users.Where(x => x.Id == userModel.Id).FirstOrDefault();
            List<string> roles = (await userManager.GetRolesAsync(userModel)).ToList();
            
            return roles;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return null;
        }
    }

    public async Task<List<UserModel>> GetUsersInRole(string RoleName)
    {
        try
        {
            List<UserModel> users = (await userManager.GetUsersInRoleAsync(RoleName)).ToList();
            return users;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            throw;         
        }
        
    }
#endregion
}