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
using Models.Users.Teacher;
using Microsoft.AspNetCore.Http;
using Models.InputModel;

namespace lms_with_moodle.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    [Authorize]
    public class ClassScheduleController : ControllerBase
    {
        
        private readonly UserManager<UserModel> userManager;
        private readonly AppDbContext appDbContext;
        private readonly SignInManager<UserModel> signInManager;
        private readonly RoleManager<IdentityRole<int>> roleManager;
        private readonly ClassScheduleService classScheduleService;

        //MoodleApi moodleApi;
        
        public ClassScheduleController(UserManager<UserModel> _userManager 
                                , SignInManager<UserModel> _signinManager
                                , RoleManager<IdentityRole<int>> _roleManager
                                , AppDbContext dbContext)
        {
            userManager = _userManager;
            appDbContext = dbContext;
            signInManager =_signinManager;
            roleManager = _roleManager;

            //moodleApi = new MoodleApi();

            //classScheduleService = new ClassScheduleService(appDbContext , moodleApi);
            classScheduleService = new ClassScheduleService(appDbContext);

            
        }

#region ClassesSchedule

        [HttpGet]
        [ProducesResponseType(typeof(List<GradeModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult getClassSchedule(int classId)
        {
            try
            {   
                List<ClassScheduleView> classScheduleViews = new List<ClassScheduleView>();

                if(classId != -1)
                {
                    classScheduleViews = appDbContext.ClassScheduleView.Where(x => x.ClassId == classId).ToList();
                    foreach (var schedule in classScheduleViews)
                    {
                        int moodleId = appDbContext.School_Lessons.Where(x => x.classId == schedule.ClassId && x.Lesson_Id == schedule.LessonId).FirstOrDefault().Moodle_Id;
                        schedule.moodleUrl = AppSettings.moddleCourseUrl + moodleId;
                    }
                }
                else
                {
                    //It means Student send request
                    //We set IdNumber as userId in Token
                    string idNumber = userManager.GetUserId(User);
                    int userId = appDbContext.Users.Where(x => x.MelliCode == idNumber).FirstOrDefault().Id;
                    School_studentClass school_Student = appDbContext.School_StudentClasses.Where(x => x.UserId == userId).FirstOrDefault();

                    if(school_Student != null)
                    {
                        int userClassId = school_Student.ClassId;

                        classScheduleViews = appDbContext.ClassScheduleView.Where(x => x.ClassId == userClassId).ToList();

                        foreach (var schedule in classScheduleViews)
                        {
                            int moodleId = appDbContext.School_Lessons.Where(x => x.classId == schedule.ClassId && x.Lesson_Id == schedule.LessonId).FirstOrDefault().Moodle_Id;
                            schedule.moodleUrl = AppSettings.moddleCourseUrl + moodleId;

                            List<Meeting> meetings = appDbContext.Meetings.Where(x => x.ScheduleId == schedule.Id).ToList();
                            int absenceCount = 0;

                            foreach (var meeting in meetings)
                            {
                                int checkCount = meeting.CheckCount;
                                ParticipantInfo participantInfo = appDbContext.ParticipantInfos.Where(x => x.UserId == userId && x.MeetingId == meeting.Id).FirstOrDefault();

                                int presentCount = (participantInfo != null ? participantInfo.PresentCount : 0);

                                if(((float)presentCount / (float)checkCount) * 100 < 70)
                                {
                                    absenceCount++;
                                }
                            }

                            schedule.absenceCount = absenceCount;
                            
                        }
                    
                    }
                    
                }

                var groupedSchedule = classScheduleViews
                    .GroupBy(x => x.DayType)
                    .Select(grp => grp.ToList())
                    .ToList();

                return Ok(groupedSchedule);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<GradeModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult getTeacherSchedule()
        {
            try
            {   
                string userName = userManager.GetUserId(User);
                int teacherId = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault().Id;
                //We set IdNumber as userId in Token
                
                List<ClassScheduleView> classScheduleViews = appDbContext.ClassScheduleView.Where(x => x.TeacherId == teacherId).ToList();
                foreach (var schedule in classScheduleViews)
                {
                    int moodleId = appDbContext.School_Lessons.Where(x => x.classId == schedule.ClassId && x.Lesson_Id == schedule.LessonId).FirstOrDefault().Moodle_Id;
                    schedule.moodleUrl = AppSettings.moddleCourseUrl + moodleId;
                }

                var groupedSchedule = classScheduleViews
                    .GroupBy(x => x.DayType)
                    .Select(grp => grp.ToList())
                    .ToList();

                return Ok(groupedSchedule);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<GradeModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult getClassLessons(int classId)
        {
            try
            {             
                int grade_id = appDbContext.School_Classes.Where(x => x.Id == classId).FirstOrDefault().Grade_Id;
                
                List<LessonModel> classLessons = appDbContext.Lessons.Where(x => x.Grade_Id == grade_id).ToList();

                return Ok(classLessons);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

#region MixedSchedules

        [HttpPut]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> AddMixedClassSchedule([FromBody]MixedScheduleData mixedScheduleData)
        {
            try
            {
                bool mixedCreated = false;
                List<Class_WeeklySchedule> classSchedules = new List<Class_WeeklySchedule>();
                Class_WeeklySchedule tempSchedule = mixedScheduleData.schedle;
                
                bool hasInterupt = false;
                string mixedName = "";

                foreach (var classId in mixedScheduleData.classIds)
                {
                    tempSchedule.ClassId = classId;
                    classSchedules.Add(tempSchedule);

                    School_Class schoolClass = appDbContext.School_Classes.Where(x => x.Id == classId).FirstOrDefault();
                    mixedName += schoolClass.ClassName + "-";

                    if(tempSchedule.EndHour <= tempSchedule.StartHour)
                        return BadRequest("ساعت درس به درستی انتخاب نشده است");
                        
                    if(tempSchedule.TeacherId == 0)
                        return BadRequest("معلمی انتخاب شده است");
                        
                    if(tempSchedule.ClassId != 0)
                    {
                        //Check for interupt class Schedule
                        object result = classScheduleService.CheckInteruptSchedule(tempSchedule);

                        try{hasInterupt = (bool)result;}catch{}

                        if(!hasInterupt)
                        {
                            return BadRequest((string)result);
                        }
                    }
                }

                MixedSchedule mixedSchedule = new MixedSchedule();
                mixedSchedule.MixedName = mixedName.Remove(mixedName.Length - 1 , 1);

                await appDbContext.MixedSchedules.AddAsync(mixedSchedule);
                await appDbContext.SaveChangesAsync();

                foreach (var classSchedule in classSchedules)
                {                
                    classSchedule.MixedId = mixedSchedule.Id;
                    Class_WeeklySchedule schedule = await classScheduleService.AddClassSchedule(classSchedule);
                }

                return Ok("کلاس تجمیعی با موفقیت ایجاد شد");
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    
#endregion

        [HttpPut]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> AddClassSchedule([FromBody]Class_WeeklySchedule classSchedule)
        {
            try
            {
                if(classSchedule.EndHour <= classSchedule.StartHour)
                    return BadRequest("ساعت درس به درستی انتخاب نشده است");
                    
                if(classSchedule.TeacherId == 0)
                    return BadRequest("معلمی انتخاب شده است");
                    
                if(classSchedule.ClassId != 0)
                {
                    //Check for interupt class Schedule
                    object result = classScheduleService.CheckInteruptSchedule(classSchedule);
                    bool noInterupt = false;

                    try{noInterupt = (bool)result;}catch{}

                    if(noInterupt)
                    {
                        Class_WeeklySchedule schedule = await classScheduleService.AddClassSchedule(classSchedule);
                        ClassScheduleView classScheduleView = appDbContext.ClassScheduleView.Where(x => x.Id == schedule.Id).FirstOrDefault();

                        if(classScheduleView != null)
                        {
                            return Ok(classScheduleView);
                        }
                        
                        return BadRequest("افزودن ساعت با مشکل مواجه لطفا بعدا تلاش نمایدد");
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
                    object result = classScheduleService.CheckInteruptSchedule(classSchedule);
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
        [ProducesResponseType(typeof(int), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> DeleteClassSchedule(int scheduleId)
        {
            try
            {
                Class_WeeklySchedule classSchedule = appDbContext.ClassWeeklySchedules.Where(x => x.Id == scheduleId).FirstOrDefault();

                if(classSchedule.Id != 0)
                {
                    int lessonMoodleId = appDbContext.School_Lessons.Where(x => x.Lesson_Id == classSchedule.LessonId && x.classId == classSchedule.ClassId).FirstOrDefault().Moodle_Id;

                    EnrolUser teacher = new EnrolUser();
                    teacher.lessonId = lessonMoodleId;
                    teacher.UserId = appDbContext.Users.Where(x => x.Id == classSchedule.TeacherId).FirstOrDefault().Moodle_Id;

                    //bool unassignTeacher = await moodleApi.UnAssignUsersFromCourse(new List<EnrolUser>{teacher});
                    bool unassignTeacher = true;

                    if(unassignTeacher)
                    {
                        appDbContext.ClassWeeklySchedules.Remove(classSchedule);
                        appDbContext.SaveChanges();

                        if(appDbContext.ClassWeeklySchedules.Where(x => x.ClassId == classSchedule.ClassId && x.LessonId == classSchedule.LessonId).FirstOrDefault() == null)
                        {
                            //await moodleApi.setCourseVisible(lessonMoodleId , false);
                        }

                        Meeting meeting = appDbContext.Meetings.Where(x => x.ScheduleId == classSchedule.Id).FirstOrDefault();
                        if(meeting != null)
                        {
                            appDbContext.ParticipantInfos.RemoveRange(appDbContext.ParticipantInfos.Where(x => x.MeetingId == meeting.Id).ToList());
                            appDbContext.Meetings.Remove(meeting);
                        }

                        await appDbContext.SaveChangesAsync();

                        return Ok(scheduleId);
                    }

                    return BadRequest("لطفا بعدا تلاش کنید");
                }

                return BadRequest("ساعتی انتخاب نشده است");
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
        
#endregion   


    }
}