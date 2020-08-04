using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Models.Teacher;
using Models.User;

namespace Models
{
    public class AppDbContext : IdentityDbContext<UserModel , IdentityRole<int> , int>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
            
        }

        public DbSet<TeacherModel_View> TeacherView {get; set;}
        public DbSet<CourseNotify> CourseNotifies {get; set;}
        public DbSet<TeacherCourseInfo> TeacherCourse {get; set;}
        public DbSet<VerificationCodeModel> VerificationCodes {get; set;}
        public DbSet<Meeting> Meetings {get; set;}
        public DbSet<ParticipantInfo> ParticipantInfos {get; set;}
        public DbSet<SchoolModel> Schools {get; set;}
        public DbSet<NewsModel> News {get; set;}
        public DbSet<BaseModel> Bases {get; set;}
        public DbSet<StudyFieldModel> StudyFields {get; set;}
        public DbSet<GradeModel> Grades {get; set;}
        public DbSet<LessonModel> Lessons {get; set;}
        public DbSet<School_Class> School_Classes {get; set;}
        public DbSet<School_Bases> School_Bases {get; set;}
        public DbSet<School_Grades> School_Grades {get; set;}
        public DbSet<School_StudyFields> School_StudyFields {get; set;}
        public DbSet<AdminDetail> AdminDetails {get; set;}
        public DbSet<ManagerDetail> ManagerDetails {get; set;}
        public DbSet<StudentDetail> StudentDetails {get; set;}
        public DbSet<Class_WeeklySchedule> ClassWeeklySchedules {get; set;}
        public DbSet<ClassScheduleView> ClassScheduleView {get; set;}


        // protected override void OnModelCreating(ModelBuilder builder)
        // {
        //     base.OnModelCreating(builder);

        // }
    }
}