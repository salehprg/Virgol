using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Models.User;
using Models.Users.Teacher;
using Virgol.School.Models;

namespace Models
{
    public class AppDbContext : IdentityDbContext<UserModel , IdentityRole<int> , int>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
            
        }

        public DbSet<CourseNotify> CourseNotifies {get; set;}
        //public DbSet<TeacherCourseInfo> TeacherCourse {get; set;}
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
        public DbSet<DocumentModel> Documents {get; set;}
        public DbSet<StreamModel> Streams {get; set;}
        public DbSet<PaymentsModel> Payments {get; set;}
        public DbSet<ServicePrice> ServicePrices {get; set;}
        public DbSet<SiteSettings> SiteSettings {get; set;}
        public DbSet<ServicesModel> Services {get; set;}
        public DbSet<DomainInfoModel> DomainInfos {get; set;}
        public DbSet<ExtraLesson> ExtraLessons {get; set;}
        public DbSet<ReqForm> ReqForms {get; set;}
        public DbSet<SMSServiceModel> SMSServices {get; set;}
        public DbSet<MultiTeacherSchedules> MultiTeacherSchedules {get; set;}

        //Views
        public DbSet<ClassScheduleView> ClassScheduleView {get; set;}
        public DbSet<ParticipantView> ParticipantViews {get; set;}
        public DbSet<StudentViewModel> StudentViews {get; set;}
        public DbSet<TeacherViewModel> TeacherViews {get; set;}
        public DbSet<MeetingView> MeetingViews {get; set;}
        public DbSet<PaymentView> PaymentsView {get; set;}
        public DbSet<ExtraLessonView> ExtraLessonViews {get; set;}


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            var hasher = new PasswordHasher<UserModel>();

            #region Seed Data
            
                builder.Entity<SiteSettings>().HasData(
                    new SiteSettings
                    {
                        Id = 1,
                        key = Settingkey.PayPingURL , 
                        value = "https://api.payping.ir"
                    } ,
                    new SiteSettings
                    {
                        Id = 2,
                        key = Settingkey.PayPingToken , 
                        value = "token"
                    }
                );

            #endregion

            #region Foreign Key Cofigure

                #region SchoolModel

                    builder.Entity<School_Bases>()
                        .HasOne<SchoolModel>()
                        .WithMany()
                        .HasForeignKey(x => x.School_Id)
                        .HasPrincipalKey(x => x.Id)
                        .OnDelete(DeleteBehavior.Cascade);

                    builder.Entity<School_Grades>()
                        .HasOne<SchoolModel>()
                        .WithMany()
                        .HasForeignKey(x => x.School_Id)
                        .HasPrincipalKey(x => x.Id)
                        .OnDelete(DeleteBehavior.Cascade);

                    builder.Entity<School_Lessons>()
                        .HasOne<SchoolModel>()
                        .WithMany()
                        .HasForeignKey(x => x.School_Id)
                        .HasPrincipalKey(x => x.Id)
                        .OnDelete(DeleteBehavior.Cascade);

                    builder.Entity<School_StudyFields>()
                        .HasOne<SchoolModel>()
                        .WithMany()
                        .HasForeignKey(x => x.School_Id)
                        .HasPrincipalKey(x => x.Id)
                        .OnDelete(DeleteBehavior.Cascade);

                    builder.Entity<School_Class>()
                        .HasOne<SchoolModel>()
                        .WithMany()
                        .HasForeignKey(x => x.School_Id)
                        .HasPrincipalKey(x => x.Id)
                        .OnDelete(DeleteBehavior.Cascade);

                #endregion

                #region SchoolClass

                    builder.Entity<Class_WeeklySchedule>()
                        .HasOne<School_Class>()
                        .WithMany()
                        .HasForeignKey(x => x.ClassId)
                        .HasPrincipalKey(x => x.Id)
                        .OnDelete(DeleteBehavior.Cascade);

                    builder.Entity<School_studentClass>()
                        .HasOne<School_Class>()
                        .WithMany()
                        .HasForeignKey(x => x.ClassId)
                        .HasPrincipalKey(x => x.Id)
                        .OnDelete(DeleteBehavior.Cascade);

                    builder.Entity<School_Lessons>()
                        .HasOne<School_Class>()
                        .WithMany()
                        .HasForeignKey(x => x.classId)
                        .HasPrincipalKey(x => x.Id)
                        .OnDelete(DeleteBehavior.Cascade);
                    
                #endregion

                builder.Entity<ParticipantInfo>()
                    .HasOne<Meeting>()
                    .WithMany()
                    .HasForeignKey(x => x.MeetingId)
                    .HasPrincipalKey(x => x.Id)
                    .OnDelete(DeleteBehavior.Cascade);

                #region UserModel

                    builder.Entity<Class_WeeklySchedule>()
                        .HasOne<UserModel>()
                        .WithMany()
                        .HasForeignKey(x => x.TeacherId)
                        .HasPrincipalKey(x => x.Id)
                        .OnDelete(DeleteBehavior.Cascade);

                    builder.Entity<NewsModel>()
                        .HasOne<UserModel>()
                        .WithMany()
                        .HasForeignKey(x => x.AutherId)
                        .HasPrincipalKey(x => x.Id)
                        .OnDelete(DeleteBehavior.Cascade);

                    builder.Entity<TeacherDetail>()
                        .HasOne<UserModel>()
                        .WithMany()
                        .HasForeignKey(x => x.TeacherId)
                        .HasPrincipalKey(x => x.Id)
                        .OnDelete(DeleteBehavior.Cascade);
                    
                    builder.Entity<School_studentClass>()
                        .HasOne<UserModel>()
                        .WithMany()
                        .HasForeignKey(x => x.UserId)
                        .HasPrincipalKey(x => x.Id)
                        .OnDelete(DeleteBehavior.Cascade);

                    builder.Entity<StudentDetail>()
                        .HasOne<UserModel>()
                        .WithMany()
                        .HasForeignKey(x => x.UserId)
                        .HasPrincipalKey(x => x.Id)
                        .OnDelete(DeleteBehavior.Cascade);
                    
                    builder.Entity<ManagerDetail>()
                        .HasOne<UserModel>()
                        .WithMany()
                        .HasForeignKey(x => x.UserId)
                        .HasPrincipalKey(x => x.Id)
                        .OnDelete(DeleteBehavior.Cascade);

                    builder.Entity<AdminDetail>()
                        .HasOne<UserModel>()
                        .WithMany()
                        .HasForeignKey(x => x.UserId)
                        .HasPrincipalKey(x => x.Id)
                        .OnDelete(DeleteBehavior.Cascade);

                    builder.Entity<ExtraLesson>()
                        .HasOne<UserModel>()
                        .WithMany()
                        .HasForeignKey(x => x.UserId)
                        .HasPrincipalKey(x => x.Id)
                        .OnDelete(DeleteBehavior.Cascade);

                #endregion

            #endregion
        
        
        }
    }
}