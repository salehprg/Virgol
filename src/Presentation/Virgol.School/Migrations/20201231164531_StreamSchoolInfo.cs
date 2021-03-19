using Microsoft.EntityFrameworkCore.Migrations;

namespace Virgol.Migrations
{
    public partial class StreamSchoolInfo : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OBS_Key",
                table: "Streams");

            migrationBuilder.AddColumn<string>(
                name: "MeetingId",
                table: "Streams",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "APIPassword",
                table: "Schools",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "streamKey",
                table: "Schools",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MeetingId",
                table: "Streams");

            migrationBuilder.DropColumn(
                name: "APIPassword",
                table: "Schools");

            migrationBuilder.DropColumn(
                name: "streamKey",
                table: "Schools");

            migrationBuilder.AddColumn<string>(
                name: "OBS_Key",
                table: "Streams",
                type: "text",
                nullable: true);
        }
    }
}
