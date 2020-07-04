using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace lms_with_moodle.Migrations
{
    public partial class ScheduleDetails : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ScheduleDetails",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StudentId = table.Column<int>(nullable: false),
                    CourseName = table.Column<string>(nullable: true),
                    CourseTime = table.Column<DateTime>(nullable: false),
                    Sent = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScheduleDetails", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ScheduleDetails");
        }
    }
}
