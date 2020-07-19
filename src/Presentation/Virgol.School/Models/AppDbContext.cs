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
        public DbSet<UserDetail> UserDetails {get; set;}
        public DbSet<SchoolModel> Schools {get; set;}
        public DbSet<Manager> Managers {get; set;}


        // protected override void OnModelCreating(ModelBuilder builder)
        // {
        //     base.OnModelCreating(builder);

        // }
    }
}