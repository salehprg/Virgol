using Microsoft.EntityFrameworkCore.Migrations;

namespace lms_with_moodle.Migrations
{
    public partial class NewConfig3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_School_StudentClasses_UserId",
                table: "School_StudentClasses",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_School_Lessons_classId",
                table: "School_Lessons",
                column: "classId");

            migrationBuilder.CreateIndex(
                name: "IX_News_AutherId",
                table: "News",
                column: "AutherId");

            migrationBuilder.CreateIndex(
                name: "IX_ClassWeeklySchedules_TeacherId",
                table: "ClassWeeklySchedules",
                column: "TeacherId");

            migrationBuilder.AddForeignKey(
                name: "FK_ClassWeeklySchedules_AspNetUsers_TeacherId",
                table: "ClassWeeklySchedules",
                column: "TeacherId",
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
                name: "FK_School_Lessons_School_Classes_classId",
                table: "School_Lessons",
                column: "classId",
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
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ClassWeeklySchedules_AspNetUsers_TeacherId",
                table: "ClassWeeklySchedules");

            migrationBuilder.DropForeignKey(
                name: "FK_News_AspNetUsers_AutherId",
                table: "News");

            migrationBuilder.DropForeignKey(
                name: "FK_School_Lessons_School_Classes_classId",
                table: "School_Lessons");

            migrationBuilder.DropForeignKey(
                name: "FK_School_StudentClasses_AspNetUsers_UserId",
                table: "School_StudentClasses");

            migrationBuilder.DropIndex(
                name: "IX_School_StudentClasses_UserId",
                table: "School_StudentClasses");

            migrationBuilder.DropIndex(
                name: "IX_School_Lessons_classId",
                table: "School_Lessons");

            migrationBuilder.DropIndex(
                name: "IX_News_AutherId",
                table: "News");

            migrationBuilder.DropIndex(
                name: "IX_ClassWeeklySchedules_TeacherId",
                table: "ClassWeeklySchedules");
        }
    }
}
