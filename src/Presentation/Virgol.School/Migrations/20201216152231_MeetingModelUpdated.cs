using Microsoft.EntityFrameworkCore.Migrations;

namespace lms_with_moodle.Migrations
{
    public partial class MeetingModelUpdated : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AttendeeCount",
                table: "Meetings");

            migrationBuilder.DropColumn(
                name: "PresentCount",
                table: "Meetings");

            migrationBuilder.AddColumn<int>(
                name: "ServiceId",
                table: "Meetings",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ServiceId",
                table: "Meetings");

            migrationBuilder.AddColumn<int>(
                name: "AttendeeCount",
                table: "Meetings",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PresentCount",
                table: "Meetings",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
