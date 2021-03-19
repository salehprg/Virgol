using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Virgol.Migrations
{
    public partial class schemaChanged : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.AlterColumn<string>(
                name: "SchoolIdNumber",
                table: "Schools",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.AlterColumn<int>(
                name: "SchoolIdNumber",
                table: "Schools",
                type: "integer",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);
        }
    }
}
