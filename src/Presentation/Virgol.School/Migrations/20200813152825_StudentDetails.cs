using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Virgol.Migrations
{
    public partial class StudentDetails : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MotherMelliCode",
                table: "StudentDetails");

            migrationBuilder.DropColumn(
                name: "MotherName",
                table: "StudentDetails");

            migrationBuilder.AddColumn<DateTime>(
                name: "birthDate",
                table: "TeacherDetails",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "cityBirth",
                table: "TeacherDetails",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "personalIdNUmber",
                table: "TeacherDetails",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "cityBirth",
                table: "StudentDetails",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "birthDate",
                table: "TeacherDetails");

            migrationBuilder.DropColumn(
                name: "cityBirth",
                table: "TeacherDetails");

            migrationBuilder.DropColumn(
                name: "personalIdNUmber",
                table: "TeacherDetails");

            migrationBuilder.DropColumn(
                name: "cityBirth",
                table: "StudentDetails");

            migrationBuilder.AddColumn<string>(
                name: "MotherMelliCode",
                table: "StudentDetails",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MotherName",
                table: "StudentDetails",
                type: "text",
                nullable: true);
        }
    }
}
