using Microsoft.EntityFrameworkCore.Migrations;

namespace Virgol.Migrations
{
    public partial class MeetingUpdated : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ModeretorId",
                table: "Meetings");

            migrationBuilder.AddColumn<int>(
                name: "LessonId",
                table: "Meetings",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TeacherId",
                table: "Meetings",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LessonId",
                table: "Meetings");

            migrationBuilder.DropColumn(
                name: "TeacherId",
                table: "Meetings");

            migrationBuilder.AddColumn<int>(
                name: "ModeretorId",
                table: "Meetings",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
