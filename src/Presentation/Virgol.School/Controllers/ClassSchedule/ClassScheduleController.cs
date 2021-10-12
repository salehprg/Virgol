using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using Models;
using Microsoft.AspNetCore.Identity;
using Models.User;
using Microsoft.AspNetCore.Authorization;
using Virgol.Helper;
using Models.Users.Roles;
using Virgol.School.Models;

namespace Virgol.Controllers
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
        private readonly UserService userService;

        MoodleApi moodleApi;
        
        public ClassScheduleController(UserManager<UserModel> _userManager 
                                , SignInManager<UserModel> _signinManager
                                , RoleManager<IdentityRole<int>> _roleManager
                                , AppDbContext dbContext)
        {
            userManager = _userManager;
            appDbContext = dbContext;
            signInManager =_signinManager;
            roleManager = _roleManager;

            moodleApi = new MoodleApi(AppSettings.GetValueFromDatabase(dbContext , "Token_moodle"));

            classScheduleService = new ClassScheduleService(appDbContext , moodleApi);
            //classScheduleService = new ClassScheduleService(appDbContext);
            userService = new UserService(userManager , appDbContext);

            
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
                        //int moodleId = 0;
                        schedule.moodleUrl = AppSettings.moddleCourseUrl + moodleId;
                    }
                }
                else
                {
                    //It means Student send request
                    //We set IdNumber as userId in Token
                    UserModel student = userService.GetUserModel(User);
                    int userId = student.Id;

                    List<ExtraLesson> extraLessons = appDbContext.ExtraLessons.Where(x => x.UserId == userId).ToList();
                    List<School_studentClass> tempStudentDatas = appDbContext.School_StudentClasses.Where(x => x.UserId == userId).ToList();
                    
                    School_studentClass school_Student = null;

                    foreach (var studentData in tempStudentDatas)
                    {
                        if(extraLessons.Where(x => x.ClassId == studentData.ClassId).FirstOrDefault() == null)
                        {
                            school_Student = studentData;
                            break;
                        }
                    }

                    if(school_Student != null)
                    {
                        int userClassId = school_Student.ClassId;

                        classScheduleViews = appDbContext.ClassScheduleView.Where(x => x.ClassId == userClassId).ToList();

                        
                        foreach (var extraLesson in extraLessons)
                        {
                            List<ClassScheduleView> extraLessonSchedule = appDbContext.ClassScheduleView.Where(x => x.ClassId == extraLesson.ClassId && x.LessonId == extraLesson.lessonId).ToList();

                            classScheduleViews.AddRange(extraLessonSchedule);
                        }

                        foreach (var schedule in classScheduleViews)
                        {
                            int moodleId = appDbContext.School_Lessons.Where(x => x.classId == schedule.ClassId && x.Lesson_Id == schedule.LessonId).FirstOrDefault().Moodle_Id;
                            //int moodleId = 0;
                            schedule.moodleUrl = AppSettings.moddleCourseUrl + moodleId;

                            List<Meeting> meetings = appDbContext.Meetings.Where(x => x.ScheduleId == schedule.Id).ToList();
                            int absenceCount = 0;

                            foreach (var meeting in meetings)
                            {
                                int checkCount = meeting.CheckCount;
                                ParticipantInfo participantInfo = appDbContext.ParticipantInfos.Where(x => x.UserId == userId && x.MeetingId == meeting.Id).FirstOrDefault();

                               // int presentCount = (participantInfo != null ? participantInfo.PresentCount : 0);
                                
                                if(participantInfo == null || (participantInfo != null && !participantInfo.IsPresent))
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
        [Authorize( Roles = Roles.Teacher + "," + Roles.Student)]
        [ProducesResponseType(typeof(List<CourseDetail>), 200)]
        public IActionResult GetGroupedSchedule(int classId)
        {
            try
            {   
                string userName = userManager.GetUserId(User);
                int userId = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault().Id;
                //We set IdNumber as userId in Token
                
                List<ClassScheduleView> classScheduleViews = new List<ClassScheduleView>();

                if(classId == 0)
                {
                    //reach here when request from teacher
                    classScheduleViews = appDbContext.ClassScheduleView.Where(x => x.TeacherId == userId).ToList();
                }
                else
                {
                    classScheduleViews = appDbContext.ClassScheduleView.Where(x => x.ClassId == classId).ToList();
                }

                var groupedSchedule = new List<ClassScheduleView>();

                foreach (var schedule in classScheduleViews)
                {
                    int moodleId = appDbContext.School_Lessons.Where(x => x.classId == schedule.ClassId && x.Lesson_Id == schedule.LessonId).FirstOrDefault().Moodle_Id;
                    //int moodleId = 0;
                    schedule.moodleUrl = AppSettings.moddleCourseUrl + moodleId;

                    if(groupedSchedule.Where(x => x.ClassId == schedule.ClassId && x.LessonId == schedule.LessonId).FirstOrDefault() == null)
                    {
                        groupedSchedule.Add(schedule);
                    }
                }

                

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
                UserModel model = userService.GetUserModel(User);
                int teacherId = model.Id;
                //We set IdNumber as userId in Token
                
                List<ClassScheduleView> classScheduleViews = appDbContext.ClassScheduleView.Where(x => x.TeacherId == teacherId).ToList();
                List<MultiTeacherSchedules> multiSchedules = appDbContext.MultiTeacherSchedules.Where(x => x.TeacherId == teacherId).ToList();

                foreach (var multiSchedule in multiSchedules)
                {
                    ClassScheduleView scheduleView = appDbContext.ClassScheduleView.Where(x => x.Id == multiSchedule.ScheduleId).FirstOrDefault();
                    scheduleView.TeacherId = teacherId;
                    scheduleView.FirstName = model.FirstName;
                    scheduleView.FirstName = model.LastName;

                    classScheduleViews.Add(scheduleView);
                }

                classScheduleViews.Distinct();

                foreach (var schedule in classScheduleViews)
                {
                    int moodleId = appDbContext.School_Lessons.Where(x => x.classId == schedule.ClassId && x.Lesson_Id == schedule.LessonId).FirstOrDefault().Moodle_Id;
                    //int moodleId = 0;
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

        [Authorize(Roles = Roles.Manager + "," + Roles.CoManager)]
        public IActionResult GetMixedSchedules()
        {
            try
            {
                string username = userManager.GetUserId(User);
                UserModel manager = appDbContext.Users.Where(x => x.UserName == username).FirstOrDefault();
                int schoolId = appDbContext.Schools.Where(x => x.ManagerId == manager.Id || x.Id == manager.SchoolId).FirstOrDefault().Id;
                
                List<ClassScheduleView> classScheduleViews = appDbContext.ClassScheduleView.Where(x => x.MixedId != 0 && x.School_Id == schoolId).ToList();

                var groupedMixed = classScheduleViews
                            .GroupBy(x => x.MixedId);

                var result = new List<ClassScheduleView>();

                foreach (var mixedSchedule in groupedMixed)
                {
                    ClassScheduleView classSchedule = mixedSchedule.ToList()[0];
                    MixedSchedule mixedData = appDbContext.MixedSchedules.Where(x => x.Id == mixedSchedule.Key).FirstOrDefault();
                    if(mixedData != null)
                    {
                        classSchedule.ClassName = mixedData.MixedName;

                        result.Add(classSchedule);
                    }
                }

                return Ok(result);
                                
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                
                return BadRequest(ex.Message);
            }

        }

        [HttpPut]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> AddMixedClassSchedule([FromBody]MixedScheduleData mixedScheduleData)
        {
            try
            {
                //bool mixedCreated = false;
                List<Class_WeeklySchedule> classSchedules = new List<Class_WeeklySchedule>();

                
                
                bool hasInterupt = false;
                string mixedName = "";

                string lessonCode = appDbContext.Lessons.Where(x => x.Id == mixedScheduleData.schedule.LessonId).FirstOrDefault().LessonCode;
                List<LessonModel> lessons = appDbContext.Lessons.Where(x => x.LessonCode == lessonCode).ToList();

                foreach (var classId in mixedScheduleData.classIds)
                {
                    School_Class schoolClass = appDbContext.School_Classes.Where(x => x.Id == classId).FirstOrDefault();
                    
                    LessonModel lesson = lessons.Where(x => x.Grade_Id == schoolClass.Grade_Id).FirstOrDefault();

                    Class_WeeklySchedule tempSchedule = new Class_WeeklySchedule();
                    tempSchedule.DayType = mixedScheduleData.schedule.DayType;
                    tempSchedule.TeacherId = mixedScheduleData.schedule.TeacherId;
                    tempSchedule.StartHour = mixedScheduleData.schedule.StartHour;
                    tempSchedule.EndHour = mixedScheduleData.schedule.EndHour;
                    tempSchedule.LessonId = lesson.Id;
                    tempSchedule.weekly = mixedScheduleData.schedule.weekly;
                    tempSchedule.ClassId = classId;

                    classSchedules.Add(tempSchedule);

                    mixedName += schoolClass.ClassName + "-";

                    if(tempSchedule.EndHour <= tempSchedule.StartHour)
                        return BadRequest("ساعت درس به درستی انتخاب نشده است");
                        
                    if(tempSchedule.TeacherId == 0)
                        return BadRequest("معلمی انتخاب شده است");
                        
                    if(tempSchedule.ClassId != 0)
                    {
                        //Check for interupt class Schedule
                        string result = classScheduleService.CheckInteruptSchedule(tempSchedule);

                        if(!string.IsNullOrEmpty(result))
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
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteMixedClassSchedule(int mixedId)
        {
            try
            {
                if(mixedId != 0)
                {
                    MixedSchedule mixed = appDbContext.MixedSchedules.Where(x => x.Id == mixedId).FirstOrDefault();
                    if(mixed != null)
                    {
                        List<Class_WeeklySchedule> schedules = appDbContext.ClassWeeklySchedules.Where(x => x.MixedId == mixedId).ToList();
                        
                        appDbContext.MixedSchedules.Remove(mixed);
                        await appDbContext.SaveChangesAsync();

                        foreach (var schedule in schedules)
                        {
                            await classScheduleService.RemoveSchedule(schedule);
                        }

                        
                        
                        return Ok("کلاس تجمیعی با موفقیت حذف شد");
                    }
                }

                return BadRequest("خطا در دریافت اطلاعات");
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
        public async Task<IActionResult> AddClassSchedule([FromBody]Class_WeeklySchedule baseSchedule)
        {
            try
            {
                if(baseSchedule.DayType == 0 || baseSchedule.DayType > 7)
                    return BadRequest("روز مناسبی برای برگزاری کلاس انتخاب نشده است");

                if(baseSchedule.EndHour <= baseSchedule.StartHour)
                    return BadRequest("ساعت درس به درستی انتخاب نشده است");
                    
                if(baseSchedule.ListTeacherId.Count == 0)
                    return BadRequest("معلمی انتخاب نشده است");

                if(baseSchedule.ClassId == 0)
                    return BadRequest("کلاسی انتخاب نشده است");

                string message = "";
                bool noInterupt = false;

                foreach (var teacherId in baseSchedule.ListTeacherId)
                {            
                    //Check for interupt class Schedule
                    Class_WeeklySchedule temp = baseSchedule;
                    temp.TeacherId = teacherId;

                    message = classScheduleService.CheckInteruptSchedule(temp);
                    noInterupt = string.IsNullOrEmpty(message);

                    if(!noInterupt)
                        break;

                }

                if(noInterupt)
                {
                    if(baseSchedule.ListTeacherId.Count > 1)
                    {
                        baseSchedule.MultiTeacher = true;
                    }

                    if(!string.IsNullOrEmpty(baseSchedule.CustomLessonName))
                    {
                        
                        UserModel manager = userService.GetUserModel(User);
                        SchoolModel school = appDbContext.Schools.Where(x => x.ManagerId == manager.Id).FirstOrDefault();
                        School_Class school_Class = appDbContext.School_Classes.Where(x => x.School_Id == school.Id && x.Id == baseSchedule.ClassId).FirstOrDefault();

                        LessonModel freeLesson = appDbContext.Lessons.Where(x => x.Grade_Id == 0 && x.LessonName == baseSchedule.CustomLessonName).FirstOrDefault();

                        School_Lessons schoolLesson = null;
                        if(freeLesson != null)
                        {
                            schoolLesson = appDbContext.School_Lessons.Where(x => x.Lesson_Id == freeLesson.Id && x.classId == baseSchedule.ClassId).FirstOrDefault();
                        }

                        if(schoolLesson != null && schoolLesson.Moodle_Id == -1)
                        {
                            int moodleId = await moodleApi.CreateCourse(freeLesson.LessonName + " (" + school.Moodle_Id + "-" + school_Class.Moodle_Id + ")", freeLesson.LessonName + " (" + school.SchoolName + "-" + school_Class.ClassName + ")" , school_Class.Moodle_Id);
                            schoolLesson.Moodle_Id = moodleId;

                            appDbContext.School_Lessons.Update(schoolLesson);
                            await appDbContext.SaveChangesAsync();
                        }
                        if(schoolLesson == null)
                        {
                        
                            freeLesson = new LessonModel();
                            freeLesson.Grade_Id = 0;
                            freeLesson.LessonCode = "F_" + baseSchedule.ClassId.ToString();
                            freeLesson.LessonName = baseSchedule.CustomLessonName;
                            freeLesson.OrgLessonName = freeLesson.LessonName;
                            freeLesson.Vahed = 0;
                            
                            appDbContext.Lessons.Add(freeLesson);
                            await appDbContext.SaveChangesAsync();
                            
                            List<EnrolUser> enrolsManager = new List<EnrolUser>();
                            int managerMoodleId = manager.Moodle_Id;
                            int moodleId = await moodleApi.CreateCourse(freeLesson.LessonName + " (" + school.Moodle_Id + "-" + school_Class.Moodle_Id + ")", freeLesson.LessonName + " (" + school.SchoolName + "-" + school_Class.ClassName + ")" , school_Class.Moodle_Id);
                            //int moodleId = 0;

                            schoolLesson = new School_Lessons();
                            schoolLesson.Lesson_Id = freeLesson.Id;
                            schoolLesson.Moodle_Id = moodleId;
                            schoolLesson.School_Id = school.Id;
                            schoolLesson.classId = school_Class.Id;

                            //Enrol manager to all Lessons

                            EnrolUser enrol = new EnrolUser();
                            enrol.lessonId = moodleId;
                            enrol.UserId = managerMoodleId;
                            enrol.RoleId = 3;

                            enrolsManager.Add(enrol);
                            
                            appDbContext.School_Lessons.AddRange(schoolLesson);
                            await appDbContext.SaveChangesAsync();

                            await moodleApi.AssignUsersToCourse(enrolsManager);
                        }

                        baseSchedule.LessonId = schoolLesson.Lesson_Id;
                    }

                    await classScheduleService.AddClassSchedule(baseSchedule);
                }
                else
                {
                    return BadRequest(message);
                }

                if(baseSchedule.ListTeacherId.Count > 1)
                {
                    foreach (var teacherId in baseSchedule.ListTeacherId)
                    {
                        MultiTeacherSchedules multiTeacher = new MultiTeacherSchedules();
                        multiTeacher.TeacherId = teacherId;
                        multiTeacher.ScheduleId = baseSchedule.Id;

                        appDbContext.MultiTeacherSchedules.Add(multiTeacher);
                    }

                    await appDbContext.SaveChangesAsync();
                }

                ClassScheduleView classScheduleView = appDbContext.ClassScheduleView.Where(x => x.Id == baseSchedule.Id).FirstOrDefault();
                if(classScheduleView != null)
                {
                    return Ok(classScheduleView);
                }
                        
                return BadRequest("مشکلی در ثبت ساعت درسی بوجود آمد");
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    
        [HttpPost]
        [ProducesResponseType(typeof(School_Class), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> EditClassSchedule([FromBody]Class_WeeklySchedule classSchedule)
        {
            try
            {
                if(classSchedule.Id != 0)
                {
                    List<MultiTeacherSchedules> multiTeachers = appDbContext.MultiTeacherSchedules.Where(x => x.ScheduleId == classSchedule.Id).ToList();
                    
                    List<int> oldIds = multiTeachers.Select(x => x.TeacherId).ToList();

                    List<int> addTeacherIds = classSchedule.ListTeacherId.Except(oldIds).ToList();
                    List<int> removeTeacherIds = oldIds.Except(classSchedule.ListTeacherId).ToList();

                    //Check for interupt class Schedule
                    bool interupt = false;
                    string message = "";

                    foreach (var teacherId in classSchedule.ListTeacherId)
                    {            
                        //Check for interupt class Schedule
                        Class_WeeklySchedule temp = classSchedule;
                        temp.TeacherId = teacherId;

                        message = classScheduleService.CheckInteruptSchedule(temp);
                        interupt = string.IsNullOrEmpty(message);

                        if(interupt)
                            break;
                    }

                    
                    if(!interupt)
                    {
                        foreach (var teacherId in addTeacherIds)
                        {
                            MultiTeacherSchedules multiTeacher = new MultiTeacherSchedules();
                            multiTeacher.TeacherId = teacherId;
                            multiTeacher.ScheduleId = classSchedule.Id;

                            appDbContext.MultiTeacherSchedules.Add(multiTeacher);
                        }
                        foreach (var teacherId in removeTeacherIds)
                        {
                            MultiTeacherSchedules multiTeacher = appDbContext.MultiTeacherSchedules.Where(x => x.ScheduleId == classSchedule.Id && x.TeacherId == teacherId).FirstOrDefault();

                            appDbContext.MultiTeacherSchedules.Remove(multiTeacher);
                        }

                        appDbContext.ClassWeeklySchedules.Update(classSchedule);
                        await appDbContext.SaveChangesAsync();

                        return Ok("ساعت مورد نظر با موفقیت ویرایش شد");
                    }
                    else
                    {
                        return BadRequest(message);
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
                    School_Class school_Class = appDbContext.School_Classes.Where(x => x.Id == classSchedule.ClassId).FirstOrDefault();

                    bool result = await classScheduleService.RemoveSchedule(classSchedule , school_Class.Grade_Id == 0);
                    if(result)
                    {
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

#region Moodle

    [HttpPost]
    public async Task<IActionResult> MoodleSSO(int scheduleId , string userPassword)
    {
        try
        {
            UserModel userModel = userService.GetUserModel(User);

            //LDAP_db ldap = new LDAP_db(appDbContext);
            MoodleApi moodle = new MoodleApi(AppSettings.GetValueFromDatabase(appDbContext , "Token_moodle"));
            ClassScheduleView scheduleVW = appDbContext.ClassScheduleView.Where(x => x.Id == scheduleId).FirstOrDefault();

            bool isTeacher = userService.HasRole(userModel , Roles.Teacher);

            // if(!ldap.CheckUserData(userModel.UserName))
            // {
            //     await ldap.AddUserToLDAP(userModel , isTeacher , userPassword);
            // }

            int moodleId = await moodle.GetUserId(userModel.MelliCode);
            if(moodleId == -1)
            {
                moodleId = await moodle.CreateUser(userModel);
                userModel.Moodle_Id = moodleId;

                appDbContext.Users.Update(userModel);
                await appDbContext.SaveChangesAsync();
            }

            if(moodleId != userModel.Moodle_Id)
            {

                userModel.Moodle_Id = moodleId;
                appDbContext.Users.Update(userModel);
                await appDbContext.SaveChangesAsync();
            }
            
            if(isTeacher)
            {
                if(scheduleVW.TeacherId != userModel.Id)
                    return Unauthorized("شما اجازه دسترسی به این فعالیت درسی را ندارید");
            }

            List<EnrolUser> enrolsData = new List<EnrolUser>();
            List<School_Lessons> school_Lessons = appDbContext.School_Lessons.Where(x => x.School_Id == scheduleVW.School_Id && x.classId == scheduleVW.ClassId).ToList();

            if(!isTeacher)
            {
                foreach (var schoolLesson in school_Lessons)
                {
                    LessonModel lesson = appDbContext.Lessons.Where(x => x.Id == schoolLesson.Lesson_Id).FirstOrDefault();
                    if(lesson != null)
                    {
                        EnrolUser enrolInfo = new EnrolUser();
                        enrolInfo.lessonId = schoolLesson.Moodle_Id;
                        enrolInfo.UserId = userModel.Moodle_Id;
                        enrolInfo.RoleId = 5;

                        enrolsData.Add(enrolInfo);
                    }
                }
            }
            else
            {
                School_Lessons schoolLesson = school_Lessons.Where(x => x.School_Id == scheduleVW.School_Id && x.classId == scheduleVW.ClassId && x.Lesson_Id == scheduleVW.LessonId).FirstOrDefault();
                if(schoolLesson != null)
                {
                    LessonModel lesson = appDbContext.Lessons.Where(x => x.Id == schoolLesson.Lesson_Id).FirstOrDefault();

                    EnrolUser enrolInfo = new EnrolUser();
                    enrolInfo.lessonId = schoolLesson.Moodle_Id;
                    enrolInfo.UserId = userModel.Moodle_Id;
                    enrolInfo.RoleId = 3;

                    enrolsData.Add(enrolInfo);
                }
            }

            await moodle.AssignUsersToCourse(enrolsData);

            return Ok(true);

        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return BadRequest(false);
            
        }
    }

#endregion

    }
}