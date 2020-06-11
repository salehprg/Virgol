using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace lms_with_moodle.Migrations
{
    public partial class AddVerification : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_TeachersView",
                table: "TeachersView");

            migrationBuilder.RenameTable(
                name: "TeachersView",
                newName: "TeacherView");

            migrationBuilder.AlterColumn<int>(
                name: "CourseId",
                table: "TeacherView",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_TeacherView",
                table: "TeacherView",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "VerificationCodes",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VerificationCode = table.Column<string>(nullable: true),
                    UserId = table.Column<int>(nullable: false),
                    LastSend = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VerificationCodes", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VerificationCodes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TeacherView",
                table: "TeacherView");

            migrationBuilder.RenameTable(
                name: "TeacherView",
                newName: "TeachersView");

            migrationBuilder.AlterColumn<string>(
                name: "CourseId",
                table: "TeachersView",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddPrimaryKey(
                name: "PK_TeachersView",
                table: "TeachersView",
                column: "Id");
        }
    }
}
