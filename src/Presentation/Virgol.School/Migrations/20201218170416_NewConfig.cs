using Microsoft.EntityFrameworkCore.Migrations;

namespace Virgol.Migrations
{
    public partial class NewConfig : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.DropColumn(
                name: "AttendeeCount",
                table: "Meetings");

            migrationBuilder.DropColumn(
                name: "PresentCount",
                table: "Meetings");

            migrationBuilder.AlterColumn<int>(
                name: "pricePerUser",
                table: "ServicePrices",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "double precision");

            migrationBuilder.AlterColumn<int>(
                name: "amount",
                table: "Payments",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "double precision");

            migrationBuilder.AddColumn<int>(
                name: "UserCount",
                table: "Payments",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "statusMessage",
                table: "Payments",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ServiceId",
                table: "Meetings",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_TeacherDetails_TeacherId",
                table: "TeacherDetails",
                column: "TeacherId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentDetails_UserId",
                table: "StudentDetails",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_School_StudyFields_School_Id",
                table: "School_StudyFields",
                column: "School_Id");

            migrationBuilder.CreateIndex(
                name: "IX_School_StudentClasses_ClassId",
                table: "School_StudentClasses",
                column: "ClassId");

            migrationBuilder.CreateIndex(
                name: "IX_School_StudentClasses_UserId",
                table: "School_StudentClasses",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_School_Lessons_School_Id",
                table: "School_Lessons",
                column: "School_Id");

            migrationBuilder.CreateIndex(
                name: "IX_School_Lessons_classId",
                table: "School_Lessons",
                column: "classId");

            migrationBuilder.CreateIndex(
                name: "IX_School_Grades_School_Id",
                table: "School_Grades",
                column: "School_Id");

            migrationBuilder.CreateIndex(
                name: "IX_School_Classes_School_Id",
                table: "School_Classes",
                column: "School_Id");

            migrationBuilder.CreateIndex(
                name: "IX_School_Bases_School_Id",
                table: "School_Bases",
                column: "School_Id");

            migrationBuilder.CreateIndex(
                name: "IX_ParticipantInfos_MeetingId",
                table: "ParticipantInfos",
                column: "MeetingId");

            migrationBuilder.CreateIndex(
                name: "IX_News_AutherId",
                table: "News",
                column: "AutherId");

            migrationBuilder.CreateIndex(
                name: "IX_ManagerDetails_UserId",
                table: "ManagerDetails",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ClassWeeklySchedules_ClassId",
                table: "ClassWeeklySchedules",
                column: "ClassId");

            migrationBuilder.CreateIndex(
                name: "IX_ClassWeeklySchedules_TeacherId",
                table: "ClassWeeklySchedules",
                column: "TeacherId");

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
                name: "FK_ClassWeeklySchedules_AspNetUsers_TeacherId",
                table: "ClassWeeklySchedules",
                column: "TeacherId",
                principalTable: "AspNetUsers",
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
                name: "FK_News_AspNetUsers_AutherId",
                table: "News",
                column: "AutherId",
                principalTable: "AspNetUsers",
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
                name: "FK_School_Bases_Schools_School_Id",
                table: "School_Bases",
                column: "School_Id",
                principalTable: "Schools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_School_Classes_Schools_School_Id",
                table: "School_Classes",
                column: "School_Id",
                principalTable: "Schools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_School_Grades_Schools_School_Id",
                table: "School_Grades",
                column: "School_Id",
                principalTable: "Schools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_School_Lessons_Schools_School_Id",
                table: "School_Lessons",
                column: "School_Id",
                principalTable: "Schools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_School_Lessons_School_Classes_classId",
                table: "School_Lessons",
                column: "classId",
                principalTable: "School_Classes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_School_StudentClasses_School_Classes_ClassId",
                table: "School_StudentClasses",
                column: "ClassId",
                principalTable: "School_Classes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_School_StudentClasses_AspNetUsers_UserId",
                table: "School_StudentClasses",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_School_StudyFields_Schools_School_Id",
                table: "School_StudyFields",
                column: "School_Id",
                principalTable: "Schools",
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
                name: "FK_ClassWeeklySchedules_AspNetUsers_TeacherId",
                table: "ClassWeeklySchedules");

            migrationBuilder.DropForeignKey(
                name: "FK_ManagerDetails_AspNetUsers_UserId",
                table: "ManagerDetails");

            migrationBuilder.DropForeignKey(
                name: "FK_News_AspNetUsers_AutherId",
                table: "News");

            migrationBuilder.DropForeignKey(
                name: "FK_ParticipantInfos_Meetings_MeetingId",
                table: "ParticipantInfos");

            migrationBuilder.DropForeignKey(
                name: "FK_School_Bases_Schools_School_Id",
                table: "School_Bases");

            migrationBuilder.DropForeignKey(
                name: "FK_School_Classes_Schools_School_Id",
                table: "School_Classes");

            migrationBuilder.DropForeignKey(
                name: "FK_School_Grades_Schools_School_Id",
                table: "School_Grades");

            migrationBuilder.DropForeignKey(
                name: "FK_School_Lessons_Schools_School_Id",
                table: "School_Lessons");

            migrationBuilder.DropForeignKey(
                name: "FK_School_Lessons_School_Classes_classId",
                table: "School_Lessons");

            migrationBuilder.DropForeignKey(
                name: "FK_School_StudentClasses_School_Classes_ClassId",
                table: "School_StudentClasses");

            migrationBuilder.DropForeignKey(
                name: "FK_School_StudentClasses_AspNetUsers_UserId",
                table: "School_StudentClasses");

            migrationBuilder.DropForeignKey(
                name: "FK_School_StudyFields_Schools_School_Id",
                table: "School_StudyFields");

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
                name: "IX_School_StudyFields_School_Id",
                table: "School_StudyFields");

            migrationBuilder.DropIndex(
                name: "IX_School_StudentClasses_ClassId",
                table: "School_StudentClasses");

            migrationBuilder.DropIndex(
                name: "IX_School_StudentClasses_UserId",
                table: "School_StudentClasses");

            migrationBuilder.DropIndex(
                name: "IX_School_Lessons_School_Id",
                table: "School_Lessons");

            migrationBuilder.DropIndex(
                name: "IX_School_Lessons_classId",
                table: "School_Lessons");

            migrationBuilder.DropIndex(
                name: "IX_School_Grades_School_Id",
                table: "School_Grades");

            migrationBuilder.DropIndex(
                name: "IX_School_Classes_School_Id",
                table: "School_Classes");

            migrationBuilder.DropIndex(
                name: "IX_School_Bases_School_Id",
                table: "School_Bases");

            migrationBuilder.DropIndex(
                name: "IX_ParticipantInfos_MeetingId",
                table: "ParticipantInfos");

            migrationBuilder.DropIndex(
                name: "IX_News_AutherId",
                table: "News");

            migrationBuilder.DropIndex(
                name: "IX_ManagerDetails_UserId",
                table: "ManagerDetails");

            migrationBuilder.DropIndex(
                name: "IX_ClassWeeklySchedules_ClassId",
                table: "ClassWeeklySchedules");

            migrationBuilder.DropIndex(
                name: "IX_ClassWeeklySchedules_TeacherId",
                table: "ClassWeeklySchedules");

            migrationBuilder.DropIndex(
                name: "IX_AdminDetails_UserId",
                table: "AdminDetails");

            migrationBuilder.DropColumn(
                name: "UserCount",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "statusMessage",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "ServiceId",
                table: "Meetings");

            migrationBuilder.AlterColumn<double>(
                name: "pricePerUser",
                table: "ServicePrices",
                type: "double precision",
                nullable: false,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<double>(
                name: "amount",
                table: "Payments",
                type: "double precision",
                nullable: false,
                oldClrType: typeof(int));

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
