using Microsoft.EntityFrameworkCore.Migrations;

namespace Virgol.Migrations
{
    public partial class AllowRecord : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "EnableRecord",
                table: "Schools",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "RecordId",
                table: "Meetings",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RecordURL",
                table: "Meetings",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EnableRecord",
                table: "Schools");

            migrationBuilder.DropColumn(
                name: "RecordId",
                table: "Meetings");

            migrationBuilder.DropColumn(
                name: "RecordURL",
                table: "Meetings");
        }
    }
}
