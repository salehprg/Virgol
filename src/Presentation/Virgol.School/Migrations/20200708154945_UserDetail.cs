using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace lms_with_moodle.Migrations
{
    public partial class UserDetail : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Document2",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ShDocument",
                table: "AspNetUsers");

            migrationBuilder.CreateTable(
                name: "UserDetails",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(nullable: false),
                    ShDocument = table.Column<string>(nullable: true),
                    Document2 = table.Column<string>(nullable: true),
                    FatherName = table.Column<string>(nullable: true),
                    FatherMelliCode = table.Column<string>(nullable: true),
                    MotherName = table.Column<string>(nullable: true),
                    MotherMelliCode = table.Column<string>(nullable: true),
                    BaseId = table.Column<int>(nullable: false),
                    BirthDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserDetails", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserDetails");

            migrationBuilder.AddColumn<string>(
                name: "Document2",
                table: "AspNetUsers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ShDocument",
                table: "AspNetUsers",
                type: "text",
                nullable: true);
        }
    }
}
