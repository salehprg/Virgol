using Microsoft.EntityFrameworkCore.Migrations;

namespace lms_with_moodle.Migrations
{
    public partial class NewConfig6 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Meetings_ClassWeeklySchedules_ScheduleId",
                table: "Meetings");

            migrationBuilder.DropIndex(
                name: "IX_Meetings_ScheduleId",
                table: "Meetings");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.CreateIndex(
                name: "IX_Meetings_ScheduleId",
                table: "Meetings",
                column: "ScheduleId");

            migrationBuilder.AddForeignKey(
                name: "FK_Meetings_ClassWeeklySchedules_ScheduleId",
                table: "Meetings",
                column: "ScheduleId",
                principalTable: "ClassWeeklySchedules",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
