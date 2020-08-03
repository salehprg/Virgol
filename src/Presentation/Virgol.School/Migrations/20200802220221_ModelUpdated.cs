using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace lms_with_moodle.Migrations
{
    public partial class ModelUpdated : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AdminModels");

            migrationBuilder.DropTable(
                name: "UserDetails");

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "Schools",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SchoolAddress",
                table: "Schools",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AdminDetails",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(nullable: false),
                    SchoolsType = table.Column<int>(nullable: false),
                    SchoolLimit = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdminDetails", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "StudentDetails",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(nullable: false),
                    LatinFirstname = table.Column<string>(nullable: false),
                    LatinLastname = table.Column<string>(nullable: false),
                    ShDocument = table.Column<string>(nullable: true),
                    Document2 = table.Column<string>(nullable: true),
                    FatherName = table.Column<string>(nullable: true),
                    FatherPhoneNumber = table.Column<string>(nullable: true),
                    FatherMelliCode = table.Column<string>(nullable: true),
                    MotherName = table.Column<string>(nullable: true),
                    MotherMelliCode = table.Column<string>(nullable: true),
                    BaseId = table.Column<int>(nullable: false),
                    BirthDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentDetails", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AdminDetails");

            migrationBuilder.DropTable(
                name: "StudentDetails");

            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "Schools");

            migrationBuilder.DropColumn(
                name: "SchoolAddress",
                table: "Schools");

            migrationBuilder.CreateTable(
                name: "AdminModels",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SchoolsType = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdminModels", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserDetails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    BaseId = table.Column<int>(type: "integer", nullable: false),
                    BirthDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    Document2 = table.Column<string>(type: "text", nullable: true),
                    FatherMelliCode = table.Column<string>(type: "text", nullable: true),
                    FatherName = table.Column<string>(type: "text", nullable: true),
                    FatherPhoneNumber = table.Column<string>(type: "text", nullable: true),
                    LatinFirstname = table.Column<string>(type: "text", nullable: false),
                    LatinLastname = table.Column<string>(type: "text", nullable: false),
                    MotherMelliCode = table.Column<string>(type: "text", nullable: true),
                    MotherName = table.Column<string>(type: "text", nullable: true),
                    ShDocument = table.Column<string>(type: "text", nullable: true),
                    UserId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserDetails", x => x.Id);
                });
        }
    }
}
