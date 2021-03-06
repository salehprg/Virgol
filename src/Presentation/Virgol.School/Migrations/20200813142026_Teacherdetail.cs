using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Virgol.Migrations
{
    public partial class Teacherdetail : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LatinFirstname",
                table: "StudentDetails");

            migrationBuilder.AddColumn<string>(
                name: "LatinFirstname",
                table: "AspNetUsers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LatinLastname",
                table: "AspNetUsers",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "TeacherDetails",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TeacherId = table.Column<int>(nullable: false),
                    SchoolsId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeacherDetails", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TeacherDetails");

            migrationBuilder.DropColumn(
                name: "LatinFirstname",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "LatinLastname",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<string>(
                name: "LatinFirstname",
                table: "StudentDetails",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LatinLastname",
                table: "StudentDetails",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
