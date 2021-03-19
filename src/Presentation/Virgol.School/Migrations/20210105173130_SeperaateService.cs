using Microsoft.EntityFrameworkCore.Migrations;

namespace Virgol.Migrations
{
    public partial class SeperaateService : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_MeetingServices",
                table: "MeetingServices");

            migrationBuilder.DropColumn(
                name: "APIPassword",
                table: "Schools");

            migrationBuilder.DropColumn(
                name: "streamKey",
                table: "Schools");

            migrationBuilder.DropColumn(
                name: "streamURL",
                table: "Schools");

            migrationBuilder.DropColumn(
                name: "streamURL",
                table: "AdminDetails");

            migrationBuilder.RenameTable(
                name: "MeetingServices",
                newName: "Services");

            migrationBuilder.AddColumn<bool>(
                name: "Free",
                table: "AdminDetails",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ServiceId",
                table: "AdminDetails",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Services",
                table: "Services",
                column: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Services",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "Free",
                table: "AdminDetails");

            migrationBuilder.DropColumn(
                name: "ServiceId",
                table: "AdminDetails");

            migrationBuilder.RenameTable(
                name: "Services",
                newName: "MeetingServices");

            migrationBuilder.AddColumn<string>(
                name: "APIPassword",
                table: "Schools",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "streamKey",
                table: "Schools",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "streamURL",
                table: "Schools",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "streamURL",
                table: "AdminDetails",
                type: "text",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_MeetingServices",
                table: "MeetingServices",
                column: "Id");
        }
    }
}
