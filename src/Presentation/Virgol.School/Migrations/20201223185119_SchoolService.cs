using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Virgol.Migrations
{
    public partial class SchoolService : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdobeUrl",
                table: "Schools");

            migrationBuilder.DropColumn(
                name: "Adobe_Password",
                table: "Schools");

            migrationBuilder.DropColumn(
                name: "Adobe_Username",
                table: "Schools");

            migrationBuilder.DropColumn(
                name: "bbbSecret",
                table: "Schools");

            migrationBuilder.DropColumn(
                name: "bbbURL",
                table: "Schools");

            migrationBuilder.AddColumn<bool>(
                name: "EnableSms",
                table: "Schools",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Free",
                table: "Schools",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "ServiceIds",
                table: "Schools",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "MeetingServices",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ServiceType = table.Column<string>(nullable: true),
                    Service_URL = table.Column<string>(nullable: true),
                    Service_Login = table.Column<string>(nullable: true),
                    Service_Key = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeetingServices", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MeetingServices");

            migrationBuilder.DropColumn(
                name: "EnableSms",
                table: "Schools");

            migrationBuilder.DropColumn(
                name: "Free",
                table: "Schools");

            migrationBuilder.DropColumn(
                name: "ServiceIds",
                table: "Schools");

            migrationBuilder.AddColumn<string>(
                name: "AdobeUrl",
                table: "Schools",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Adobe_Password",
                table: "Schools",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Adobe_Username",
                table: "Schools",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "bbbSecret",
                table: "Schools",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "bbbURL",
                table: "Schools",
                type: "text",
                nullable: true);
        }
    }
}
