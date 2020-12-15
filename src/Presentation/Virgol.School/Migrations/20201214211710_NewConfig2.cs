using Microsoft.EntityFrameworkCore.Migrations;

namespace lms_with_moodle.Migrations
{
    public partial class NewConfig2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_TeacherDetails_TeacherId",
                table: "TeacherDetails",
                column: "TeacherId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentDetails_UserId",
                table: "StudentDetails",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ParticipantInfos_MeetingId",
                table: "ParticipantInfos",
                column: "MeetingId");

            migrationBuilder.CreateIndex(
                name: "IX_Meetings_ScheduleId",
                table: "Meetings",
                column: "ScheduleId");

            migrationBuilder.CreateIndex(
                name: "IX_ManagerDetails_UserId",
                table: "ManagerDetails",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ClassWeeklySchedules_ClassId",
                table: "ClassWeeklySchedules",
                column: "ClassId");

            migrationBuilder.CreateIndex(
                name: "IX_ClassWeeklySchedules_MixedId",
                table: "ClassWeeklySchedules",
                column: "MixedId");

            migrationBuilder.CreateIndex(
                name: "IX_AdminDetails_UserId",
                table: "AdminDetails",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_AdminDetails_AspNetUsers_UserId",
                table: "AdminDetails",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ClassWeeklySchedules_School_Classes_ClassId",
                table: "ClassWeeklySchedules",
                column: "ClassId",
                principalTable: "School_Classes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ClassWeeklySchedules_MixedSchedules_MixedId",
                table: "ClassWeeklySchedules",
                column: "MixedId",
                principalTable: "MixedSchedules",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ManagerDetails_AspNetUsers_UserId",
                table: "ManagerDetails",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Meetings_ClassWeeklySchedules_ScheduleId",
                table: "Meetings",
                column: "ScheduleId",
                principalTable: "ClassWeeklySchedules",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ParticipantInfos_Meetings_MeetingId",
                table: "ParticipantInfos",
                column: "MeetingId",
                principalTable: "Meetings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StudentDetails_AspNetUsers_UserId",
                table: "StudentDetails",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TeacherDetails_AspNetUsers_TeacherId",
                table: "TeacherDetails",
                column: "TeacherId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AdminDetails_AspNetUsers_UserId",
                table: "AdminDetails");

            migrationBuilder.DropForeignKey(
                name: "FK_ClassWeeklySchedules_School_Classes_ClassId",
                table: "ClassWeeklySchedules");

            migrationBuilder.DropForeignKey(
                name: "FK_ClassWeeklySchedules_MixedSchedules_MixedId",
                table: "ClassWeeklySchedules");

            migrationBuilder.DropForeignKey(
                name: "FK_ManagerDetails_AspNetUsers_UserId",
                table: "ManagerDetails");

            migrationBuilder.DropForeignKey(
                name: "FK_Meetings_ClassWeeklySchedules_ScheduleId",
                table: "Meetings");

            migrationBuilder.DropForeignKey(
                name: "FK_ParticipantInfos_Meetings_MeetingId",
                table: "ParticipantInfos");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentDetails_AspNetUsers_UserId",
                table: "StudentDetails");

            migrationBuilder.DropForeignKey(
                name: "FK_TeacherDetails_AspNetUsers_TeacherId",
                table: "TeacherDetails");

            migrationBuilder.DropIndex(
                name: "IX_TeacherDetails_TeacherId",
                table: "TeacherDetails");

            migrationBuilder.DropIndex(
                name: "IX_StudentDetails_UserId",
                table: "StudentDetails");

            migrationBuilder.DropIndex(
                name: "IX_ParticipantInfos_MeetingId",
                table: "ParticipantInfos");

            migrationBuilder.DropIndex(
                name: "IX_Meetings_ScheduleId",
                table: "Meetings");

            migrationBuilder.DropIndex(
                name: "IX_ManagerDetails_UserId",
                table: "ManagerDetails");

            migrationBuilder.DropIndex(
                name: "IX_ClassWeeklySchedules_ClassId",
                table: "ClassWeeklySchedules");

            migrationBuilder.DropIndex(
                name: "IX_ClassWeeklySchedules_MixedId",
                table: "ClassWeeklySchedules");

            migrationBuilder.DropIndex(
                name: "IX_AdminDetails_UserId",
                table: "AdminDetails");
        }
    }
}
