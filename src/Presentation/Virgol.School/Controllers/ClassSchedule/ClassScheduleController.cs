using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using Models;
using Models.MoodleApiResponse;
using Microsoft.AspNetCore.Identity;
using Models.User;
using ExcelDataReader;
using System.IO;
using Microsoft.AspNetCore.Authorization;
using lms_with_moodle.Helper;
using Microsoft.Extensions.Options;
using Models.Teacher;
using Microsoft.AspNetCore.Http;
using Models.InputModel;

namespace lms_with_moodle.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    [Authorize(Roles = "Manager")]
    public class ClassScheduleController : ControllerBase
    {
        
        private readonly AppSettings appSettings;
        private readonly UserManager<UserModel> userManager;
        private readonly AppDbContext appDbContext;
        private readonly SignInManager<UserModel> signInManager;
        private readonly RoleManager<IdentityRole<int>> roleManager;

        MoodleApi moodleApi;
        LDAP_db ldap;
        
        public ClassScheduleController(UserManager<UserModel> _userManager 
                                , SignInManager<UserModel> _signinManager
                                , RoleManager<IdentityRole<int>> _roleManager
                                , AppDbContext dbContext
                                , IOptions<AppSettings> _appsetting)
        {
            userManager = _userManager;
            appDbContext = dbContext;
            signInManager =_signinManager;
            roleManager = _roleManager;
            appSettings = _appsetting.Value;

            moodleApi = new MoodleApi(appSettings);
            ldap = new LDAP_db(appSettings);

            
        }

#region ClassesSchedule

        [HttpGet]
        [ProducesResponseType(typeof(List<GradeModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult getClassSchedule(int classId)
        {
            try
            {   
                //We set IdNumber as userId in Token
                List<ClassScheduleView> classScheduleViews = appDbContext.ClassScheduleView.Where(x => x.ClassId == classId).ToList();

                return Ok(classScheduleViews);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<GradeModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult getTeacherSchedule(int teacherId)
        {
            try
            {   
                //We set IdNumber as userId in Token
                List<ClassScheduleView> classScheduleViews = appDbContext.ClassScheduleView.Where(x => x.TeacherId == teacherId).ToList();

                return Ok(classScheduleViews);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPut]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult AddClassSchedule([FromBody]Class_WeeklySchedule classSchedule)
        {
            try
            {
                if(classSchedule.ClassId != 0)
                {
                    //Check for interupt class Schedule
                    object result = CheckInteruptSchedule(classSchedule);
                    if((bool)result)
                    {
                        appDbContext.ClassWeeklySchedules.Add(classSchedule);
                        appDbContext.SaveChanges();

                        return Ok("ساعت مورد نظر با موفقیت افزوده شد");
                    }
                    else
                    {
                        return BadRequest((string)result);
                    }
                }

                return BadRequest("کلاسی انتخاب شده است");
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    
        [HttpPost]
        [ProducesResponseType(typeof(School_Class), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult EditClassSchedule([FromBody]Class_WeeklySchedule classSchedule)
        {
            try
            {
                if(classSchedule.Id != 0)
                {
                    //Check for interupt class Schedule
                    object result = CheckInteruptSchedule(classSchedule);
                    if((bool)result)
                    {
                        appDbContext.ClassWeeklySchedules.Update(classSchedule);
                        appDbContext.SaveChanges();

                        return Ok("ساعت مورد نظر با موفقیت ویرایش شد");
                    }
                    else
                    {
                        return BadRequest((string)result);
                    }
                }

                return BadRequest("کلاسی انتخاب شده است");
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    
        [HttpDelete]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult DeleteClass([FromBody]Class_WeeklySchedule classSchedule)
        {
            try
            {
                if(classSchedule.Id != 0)
                {
                    appDbContext.ClassWeeklySchedules.Remove(classSchedule);
                    appDbContext.SaveChanges();

                    return Ok("ساعت مورد نظر با موفقیت افزوده شد");
                }

                
                return BadRequest("کلاسی انتخاب شده است");
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
        #region Functions
        [ApiExplorerSettings(IgnoreApi = true)]
        public object CheckInteruptSchedule(Class_WeeklySchedule classSchedule)
        {
            int classIntruptCount = appDbContext.ClassWeeklySchedules.Where(x => x.ClassId == classSchedule.ClassId &&
                                                                                x.DayType == classSchedule.DayType && //Check same day
                                                                                ((x.StartHour >= classSchedule.StartHour && x.StartHour <= classSchedule.EndHour) || // Check oldClass Start time between new class Time
                                                                                    (x.StartHour <= classSchedule.StartHour && x.EndHour >= classSchedule.StartHour)) // Check newClass Start Time between oldClass Time
                    ).Count();

            if(classIntruptCount > 0)
            {
                return "ساعت ایجاد شده با درس دیگر تداخل دارد";
            }
            else
            {
                int teacherIntruptCount = appDbContext.ClassWeeklySchedules.Where(x => x.TeacherId == classSchedule.TeacherId &&
                                                                        x.DayType == classSchedule.DayType && //Check same day
                                                                        ((x.StartHour >= classSchedule.StartHour && x.StartHour <= classSchedule.EndHour) || // Check oldClass Start time between new class Time
                                                                            (x.StartHour <= classSchedule.StartHour && x.EndHour >= classSchedule.StartHour)) // Check newClass Start Time between oldClass Time
                ).Count();
                if(teacherIntruptCount > 0)
                {
                    return "ساعت ایجاد شده با درس دیگر این معلم تداخل دارد";
                }
            }

            return true;
        }
        #endregion
#endregion   

    }
}