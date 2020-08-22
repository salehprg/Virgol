using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using lms_with_moodle.Helper;
using Microsoft.AspNetCore.Identity;
using Models;
using Models.InputModel;
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
        ldap = new LDAP_db(appSettings , _appDbContext);
    }

    ///<summary>
    ///Every user should have MelliCode property 
    ///</summary>
    public async Task<List<UserDataModel>> CreateUser(List<UserDataModel> users , int usersType , int schoolId , string password = null)
    {
        users = users.Where(x => x.MelliCode != null).ToList();

        List<UserDataModel> result = new List<UserDataModel>();

        foreach (var user in users)
        {
            bool melliCodeIterupt = CheckMelliCodeInterupt(user.MelliCode , 0);
            bool phoneInterupt = CheckPhoneInterupt(user.PhoneNumber);

            if(!phoneInterupt && !melliCodeIterupt && !string.IsNullOrEmpty(user.FirstName) && !string.IsNullOrEmpty(user.LastName))
            {
                int moodleId = 0;

                user.userTypeId = usersType;
                if(usersType != (int)UserType.Teacher)
                    user.SchoolId = schoolId;
                
                if((await userManager.CreateAsync(user , (!string.IsNullOrEmpty(password) ? password : user.MelliCode))).Succeeded)
                {
                    bool ldapResult = (usersType == (int)UserType.Manager ? ldap.AddUserToLDAP(user , password) : ldap.AddUserToLDAP(user , user.MelliCode));
                    if(ldapResult)
                    {
                        moodleId = await moodleApi.CreateUser(user);
                        if(moodleId != -1)
                        {
                            user.Moodle_Id = moodleId;

                            switch(usersType)
                            {
                                case (int)UserType.Student :
                                    await userManager.AddToRoleAsync(user , "User");

                                    await SyncUserDetail(user);
                                    break;

                                case (int)UserType.Teacher :
                                    await userManager.AddToRolesAsync(user , new string[]{"User" , "Teacher"});

                                    TeacherDetail teacherDetail = new TeacherDetail();
                                    user.teacherDetail.NM_schoolId = schoolId;

                                    await SyncUserDetail(user);
                                    break;

                                case (int)UserType.Manager :
                                    await userManager.AddToRolesAsync(user , new string[]{"User" , "Manager"});

                                    await SyncUserDetail(user);
                                    break;
                            }

                            appDbContext.Users.Update(user);
                            result.Add(user);
                        }
                    }
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
        bool result = false;

        foreach (var user in users)
        {
            UserModel oldData = appDbContext.Users.Where(x => x.Id == user.Id).FirstOrDefault();

            if(oldData.MelliCode != user.MelliCode)
            {
                oldData.UserName = user.MelliCode;
                ldap.EditUserName(oldData.MelliCode , user.MelliCode);
            }

            if(!string.IsNullOrEmpty(newPassword))
            {
                string token = await userManager.GeneratePasswordResetTokenAsync(oldData);
                IdentityResult chngPassword = await userManager.ResetPasswordAsync(oldData , token , newPassword);
                if(chngPassword.Succeeded)
                {
                    ldap.EditEntry(oldData.UserName , "userPassword" , newPassword);
                }
            }

            ldap.EditEntry(oldData.MelliCode , "cn" , user.FirstName);
            ldap.EditEntry(oldData.MelliCode , "sn" , user.LastName);
            ldap.EditEntry(oldData.MelliCode , "givenName" , user.FirstName);
            
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

            if(user.LatinFirstname != null && user.LatinLastname != null)
                ldap.EditMail(user);

            if(assignTeacher)
            {
                TeacherDetail teacherDetail = appDbContext.TeacherDetails.Where(x => x.TeacherId == user.Id).FirstOrDefault();
                teacherDetail.NM_schoolId = schoolId;
                user.teacherDetail = teacherDetail;
            }
            await SyncUserDetail(user);

            users.Add(user);
        }
        
        
        await appDbContext.SaveChangesAsync();
        return users;
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
            
            if(user.userTypeId == (int)UserType.Student)
            {
                appDbContext.StudentDetails.Remove(appDbContext.StudentDetails.Where(x => x.UserId == user.Id).FirstOrDefault());
                appDbContext.School_StudentClasses.RemoveRange(appDbContext.School_StudentClasses.Where(x => x.UserId == user.Id).ToList());

            }
            if(user.userTypeId == (int)UserType.Teacher)
            {
                appDbContext.ClassWeeklySchedules.RemoveRange(appDbContext.ClassWeeklySchedules.Where(x => x.TeacherId == user.Id).ToList());
                appDbContext.TeacherDetails.Remove(appDbContext.TeacherDetails.Where(x => x.TeacherId == user.Id).FirstOrDefault());
                appDbContext.Meetings.Remove(appDbContext.Meetings.Where(x => x.TeacherId == user.Id).FirstOrDefault());
                appDbContext.News.Remove(appDbContext.News.Where(x => x.AutherId == user.Id).FirstOrDefault());

            }
            if(user.userTypeId == (int)UserType.Manager)
            {
                appDbContext.News.RemoveRange(appDbContext.News.Where(x => x.AutherId == user.Id).ToList());
                appDbContext.ManagerDetails.Remove(appDbContext.ManagerDetails.Where(x => x.UserId == user.Id).FirstOrDefault());
            }

            await appDbContext.SaveChangesAsync();
            return true;
        }
        catch
        {
            return false;
        }
    }

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


    public async Task<bool> SyncUserData(List<UserModel> users)
    {
        foreach (var user in users)
        {
            try
            {
                if(!ldap.CheckUserData(user.UserName))
                {
                    ldap.AddUserToLDAP(user , user.MelliCode);
                }

                int moodleId = await moodleApi.GetUserId(user.MelliCode);
                if(moodleId == -1)
                {
                    user.Moodle_Id = await moodleApi.CreateUser(user);
                }
                else
                {
                    user.Moodle_Id = moodleId;
                }
            
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }

        appDbContext.Users.UpdateRange(users);
        await appDbContext.SaveChangesAsync();

        return true;
        
    }

    public async Task<bool> SyncUserDetail(UserDataModel user)
    {
        try
        {
            switch(user.userTypeId)
            {
                case (int)UserType.Student:
                    StudentDetail studentDetail = appDbContext.StudentDetails.Where(x => x.UserId == user.Id).FirstOrDefault();
                    if(studentDetail != null)
                    {
                        studentDetail.FatherName = user.studentDetail.FatherName;
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

                case (int)UserType.Teacher:
                    TeacherDetail teacherDetail = appDbContext.TeacherDetails.Where(x => x.TeacherId == user.Id).FirstOrDefault();
                    if(teacherDetail != null)
                    {
                        if(user.teacherDetail != null)
                        {
                            teacherDetail.personalIdNUmber = user.teacherDetail.personalIdNUmber;
                        }
                        
                        if(user.teacherDetail.NM_schoolId != 0 && !teacherDetail.SchoolsId.Contains(user.teacherDetail.NM_schoolId.ToString() + ','))
                        {
                            teacherDetail.SchoolsId += user.teacherDetail.NM_schoolId.ToString() + ',';
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
                        teacherDetail.SchoolsId = user.teacherDetail.NM_schoolId + ",";

                        await appDbContext.TeacherDetails.AddAsync(teacherDetail);
                    }
                    user.teacherDetail = teacherDetail;
                    break;

                case (int)UserType.Manager:
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
            return false;
        }

        await appDbContext.SaveChangesAsync();

        return true;
        
    }

}