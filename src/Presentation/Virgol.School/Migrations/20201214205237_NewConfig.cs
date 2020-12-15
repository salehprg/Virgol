using Microsoft.EntityFrameworkCore.Migrations;

namespace lms_with_moodle.Migrations
{
    public partial class NewConfig : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_School_StudyFields_School_Id",
                table: "School_StudyFields",
                column: "School_Id");

            migrationBuilder.CreateIndex(
                name: "IX_School_StudentClasses_ClassId",
                table: "School_StudentClasses",
                column: "ClassId");

            migrationBuilder.CreateIndex(
                name: "IX_School_Lessons_School_Id",
                table: "School_Lessons",
                column: "School_Id");

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
                name: "FK_School_StudentClasses_School_Classes_ClassId",
                table: "School_StudentClasses",
                column: "ClassId",
                principalTable: "School_Classes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_School_StudyFields_Schools_School_Id",
                table: "School_StudyFields",
                column: "School_Id",
                principalTable: "Schools",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
                name: "FK_School_StudentClasses_School_Classes_ClassId",
                table: "School_StudentClasses");

            migrationBuilder.DropForeignKey(
                name: "FK_School_StudyFields_Schools_School_Id",
                table: "School_StudyFields");

            migrationBuilder.DropIndex(
                name: "IX_School_StudyFields_School_Id",
                table: "School_StudyFields");

            migrationBuilder.DropIndex(
                name: "IX_School_StudentClasses_ClassId",
                table: "School_StudentClasses");

            migrationBuilder.DropIndex(
                name: "IX_School_Lessons_School_Id",
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
        }
    }
}
