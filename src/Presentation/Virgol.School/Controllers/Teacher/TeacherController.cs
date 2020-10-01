using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using System.Net;
using System.Security.Cryptography;
using System.Net.Http;
using System.Net.Http.Headers;
using Models.MoodleApiResponse;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Options;

using lms_with_moodle.Helper;

using Models;
using Models.User;
using Microsoft.AspNetCore.Http;
using System.IO;
using Models.MoodleApiResponse.Activity_Grade_Info;

namespace lms_with_moodle.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    [Authorize(Roles = "Teacher,Manager")]
    public class TeacherController : ControllerBase
    {
        private readonly AppSettings appSettings;
        private readonly AppDbContext appDbContext;
        private readonly UserManager<UserModel> userManager;

        //MoodleApi moodleApi;
        
        public TeacherController(AppDbContext dbContext
                                , IOptions<AppSettings> _appsetting
                                , RoleManager<IdentityRole<int>> _roleManager
                                , UserManager<UserModel> _userManager)
        {
            appDbContext = dbContext;
            appSettings = _appsetting.Value;
            userManager = _userManager;

            //moodleApi = new MoodleApi();

        }

        [HttpGet]
        [Authorize( Roles = "Teacher,Manager")]
        [ProducesResponseType(typeof(List<CourseDetail>), 200)]
        public IActionResult GetClassBook(int lessonId)
        {
            try
            {
                //userManager getuserid get MelliCode field of user beacause we set in token
                string userName = userManager.GetUserId(User);
                int teacherId = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault().Id;

                List<ClassBook> classBooks = new List<ClassBook>();
                List<MeetingView> meetings = appDbContext.MeetingViews.Where(x => x.ScheduleId == lessonId).ToList();

                int classId = appDbContext.ClassWeeklySchedules.Where(x => x.Id == lessonId).FirstOrDefault().ClassId;

                List<School_studentClass> students = appDbContext.School_StudentClasses.Where(x => x.ClassId == classId).ToList();

                foreach (var student in students)
                {
                    UserModel studentModel = appDbContext.Users.Where(x => x.Id == student.UserId).FirstOrDefault();
                    ClassBook classBook = new ClassBook();

                    classBook.AbsentCount = meetings.Count;
                    classBook.Email = studentModel.Email;
                    classBook.FirstName = studentModel.FirstName;
                    classBook.LastName = studentModel.LastName;
                    classBook.MelliCode = studentModel.MelliCode;
                    classBook.Score = 0;
                    classBook.UserId = studentModel.Id;

                    classBooks.Add(classBook);
                }

                List<ParticipantView> result = new List<ParticipantView>();

                foreach (var meeting in meetings)
                {
                    List<ParticipantView> participantViews = appDbContext.ParticipantViews.Where(x => x.MeetingId == meeting.Id).ToList();

                    ClassBook classBook = new ClassBook();

                    foreach (var participant in participantViews)
                    {
                        classBook = classBooks.Where(x => x.UserId == participant.UserId).FirstOrDefault();
                        if(classBook != null && participant.IsPresent)
                        {
                            classBook.AbsentCount--;
                        }

                        if(classBook != null)
                        {
                            if(classBook.ParticipantDetail == null)  
                                classBook.ParticipantDetail = new List<ParticipantView>();

                            classBook.ParticipantDetail.Add(participant);
                        }
                    }

                }

                // var groupedUser = result
                //         .GroupBy(x => x.UserId)
                //         .Select(grp => grp.ToList())
                //         .ToList();

                var lessonDetail = appDbContext.ClassScheduleView.Where(x => x.Id == lessonId).FirstOrDefault();
                return Ok(new {
                    classBooks,
                    lessonDetail
                    });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Authorize( Roles = "Teacher")]
        [ProducesResponseType(typeof(List<CourseDetail>), 200)]
        public IActionResult GetScheduleList()
        {
            try
            {   
                string userName = userManager.GetUserId(User);
                int teacherId = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault().Id;
                //We set IdNumber as userId in Token
                
                List<ClassScheduleView> classScheduleViews = appDbContext.ClassScheduleView.Where(x => x.TeacherId == teacherId).ToList();
                var groupedSchedule = new List<ClassScheduleView>();

                foreach (var schedule in classScheduleViews)
                {
                    int moodleId = appDbContext.School_Lessons.Where(x => x.classId == schedule.ClassId && x.Lesson_Id == schedule.LessonId).FirstOrDefault().Moodle_Id;
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
#region Category
        [HttpGet]
        [ProducesResponseType(typeof(List<CourseDetail>), 200)]
        public async Task<IActionResult> GetCetegoryNames()
        {
            
            //userManager getuserid get MelliCode field of user beacause we set in token
            // int UserId = await moodleApi.GetUserId(userManager.GetUserId(User));

            // if(UserId != -1)
            // {
            //     List<CourseDetail> userCourses = await moodleApi.getUserCourses(UserId);
            //     var groupedCategory = userCourses.GroupBy(course => course.categoryId).ToList(); //لیستی برای بدست اوردن ایدی دسته بندی ها

            //     List<CategoryDetail> categoryDetails = new List<CategoryDetail>();

            //     foreach(var id in groupedCategory)
            //     {
            //         CategoryDetail categoryDetail = await moodleApi.getCategoryDetail(id.Key);
            //         categoryDetail.CourseCount = id.Count();
                    
            //         categoryDetails.Add(categoryDetail);
            //     }

            //     return Ok(categoryDetails.Where(x => x.ParentCategory != 0).ToList());
            // }
            // else{
            //     return BadRequest();
            // }

            return Ok(true);
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<CourseDetail>), 200)]
        public async Task<IActionResult> GetCoursesInCategory(int CategoryId)
        {
            
            // int UserId = await moodleApi.GetUserId(userManager.GetUserId(User));

            // if(UserId != -1)
            // {
            //     List<CourseDetail> userCourses = await moodleApi.getUserCourses(UserId);

            //     userCourses = userCourses.Where(course => course.categoryId == CategoryId).ToList(); //Categories Courses by Categoty Id
            //     userCourses.ForEach(x => x.CourseUrl = AppSettings.moddleCourseUrl + x.id);

            //     return Ok(userCourses);
            // }
            // else
            // {
            //     return BadRequest();
            // }

            return Ok(true);
        }

#endregion

#region Grades
        [HttpGet]
        [ProducesResponseType(typeof(List<ScoresReport>), 200)]
        public async Task<IActionResult> GetGradesInCourse(int CourseId) 
        {
            // try
            // {
            //     List<AssignmentGrades_moodle> allGrades = await moodleApi.getAllGradesInCourse(CourseId);
            //     List<ScoresReport> gradeReports = new List<ScoresReport>();

            //     foreach(var grade in allGrades)
            //     {
            //         ScoresReport gradeReport = new ScoresReport();

            //         List<ScoreDetails> scoreDetails = new List<ScoreDetails>();
            //         float totalGrade = 0;

            //         foreach(var detail in grade.gradeitems.Where(x => x.itemmodule == "quiz" || x.itemmodule == "assign"))
            //         {
            //             ScoreDetails gradeDetail = new ScoreDetails();
            //             gradeDetail.ActivityGrade = detail.graderaw;
            //             gradeDetail.ActivityName = detail.itemname;

            //             scoreDetails.Add(gradeDetail);

            //             totalGrade += detail.graderaw;
            //         }

            //         gradeReport.FullName = grade.userfullname;
            //         gradeReport.scoreDetails = scoreDetails;
            //         gradeReport.TotalGrade = totalGrade;

            //         gradeReports.Add(gradeReport);
            //     }
                
            //     return Ok(gradeReports);
            // }
            // catch(Exception ex)
            // {
            //     return BadRequest(ex.Message);
            // }

            return Ok(true);
        }
#endregion

    }
}