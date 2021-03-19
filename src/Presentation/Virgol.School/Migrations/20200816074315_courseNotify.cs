using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Virgol.Migrations
{
    public partial class courseNotify : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CourseName",
                table: "CourseNotifies");

            migrationBuilder.DropColumn(
                name: "CourseTime",
                table: "CourseNotifies");

            migrationBuilder.DropColumn(
                name: "Sent",
                table: "CourseNotifies");

            migrationBuilder.DropColumn(
                name: "StudentId",
                table: "CourseNotifies");

            migrationBuilder.AddColumn<int>(
                name: "ScheduleId",
                table: "CourseNotifies",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "SentTime",
                table: "CourseNotifies",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "CourseNotifies",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ScheduleId",
                table: "CourseNotifies");

            migrationBuilder.DropColumn(
                name: "SentTime",
                table: "CourseNotifies");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "CourseNotifies");

            migrationBuilder.AddColumn<string>(
                name: "CourseName",
                table: "CourseNotifies",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CourseTime",
                table: "CourseNotifies",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "Sent",
                table: "CourseNotifies",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "StudentId",
                table: "CourseNotifies",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
