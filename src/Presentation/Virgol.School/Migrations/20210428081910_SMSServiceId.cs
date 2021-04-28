using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Virgol.Migrations
{
    public partial class SMSServiceId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EnableSms",
                table: "Schools");

            migrationBuilder.AddColumn<int>(
                name: "SMSService",
                table: "Schools",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "hashName",
                table: "Documents",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "shareType",
                table: "Documents",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "subSpaceId",
                table: "Documents",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "SMSServices",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ServiceName = table.Column<string>(nullable: true),
                    URL = table.Column<string>(nullable: true),
                    Username = table.Column<string>(nullable: true),
                    Password = table.Column<string>(nullable: true),
                    SendNumber = table.Column<string>(nullable: true),
                    APIKey = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SMSServices", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SMSServices");

            migrationBuilder.DropColumn(
                name: "SMSService",
                table: "Schools");

            migrationBuilder.DropColumn(
                name: "hashName",
                table: "Documents");

            migrationBuilder.DropColumn(
                name: "shareType",
                table: "Documents");

            migrationBuilder.DropColumn(
                name: "subSpaceId",
                table: "Documents");

            migrationBuilder.AddColumn<bool>(
                name: "EnableSms",
                table: "Schools",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
