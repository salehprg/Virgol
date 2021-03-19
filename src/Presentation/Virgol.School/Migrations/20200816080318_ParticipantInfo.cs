using Microsoft.EntityFrameworkCore.Migrations;

namespace Virgol.Migrations
{
    public partial class ParticipantInfo : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Moodle_Id",
                table: "ParticipantInfos");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "ParticipantInfos",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserId",
                table: "ParticipantInfos");

            migrationBuilder.AddColumn<int>(
                name: "Moodle_Id",
                table: "ParticipantInfos",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
