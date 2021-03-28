using Microsoft.EntityFrameworkCore.Migrations;

namespace Virgol.Migrations
{
    public partial class MixedScheduleUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ParentId",
                table: "MixedSchedules");

            migrationBuilder.DropColumn(
                name: "ScheduleId",
                table: "MixedSchedules");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ParentId",
                table: "MixedSchedules",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ScheduleId",
                table: "MixedSchedules",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
