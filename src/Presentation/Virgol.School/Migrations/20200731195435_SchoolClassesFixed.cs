using Microsoft.EntityFrameworkCore.Migrations;

namespace lms_with_moodle.Migrations
{
    public partial class SchoolClassesFixed : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Grade_MoodleId",
                table: "SchoolClasses",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "School_Id",
                table: "SchoolClasses",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Grade_MoodleId",
                table: "SchoolClasses");

            migrationBuilder.DropColumn(
                name: "School_Id",
                table: "SchoolClasses");
        }
    }
}
