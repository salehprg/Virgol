using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Models.User;
using Models.Users.Teacher;

namespace Models
{
    public class AppDbContextBackup : IdentityDbContext<UserModel , IdentityRole<int> , int>
    {
        public AppDbContextBackup(DbContextOptions<AppDbContextBackup> options)
            : base(options)
        {
            
        }

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
        public DbSet<School_studentClass> School_StudentClasses {get; set;}
        public DbSet<School_Lessons> School_Lessons {get; set;}
        public DbSet<AdminDetail> AdminDetails {get; set;}
        public DbSet<ManagerDetail> ManagerDetails {get; set;}
        public DbSet<StudentDetail> StudentDetails {get; set;}
        public DbSet<TeacherDetail> TeacherDetails {get; set;}
        public DbSet<Class_WeeklySchedule> ClassWeeklySchedules {get; set;}
        public DbSet<MixedSchedule> MixedSchedules {get; set;}
        public DbSet<State> States {get; set;}
        public DbSet<City> Cities {get; set;}
        public DbSet<Region> Regions {get; set;}

        //Views
        public DbSet<ClassScheduleView> ClassScheduleView {get; set;}
        public DbSet<ParticipantView> ParticipantViews {get; set;}
        public DbSet<StudentViewModel> StudentViews {get; set;}
        public DbSet<TeacherViewModel> TeacherViews {get; set;}
        public DbSet<MeetingView> MeetingViews {get; set;}


        // protected override void OnModelCreating(ModelBuilder builder)
        // {
        //     base.OnModelCreating(builder);

        // }
    }
}