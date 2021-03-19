using Microsoft.EntityFrameworkCore.Migrations;

namespace Virgol.Migrations
{
    public partial class StreamInfo : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "allowedRoles",
                table: "Streams",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "started",
                table: "Streams",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "allowedRoles",
                table: "Streams");

            migrationBuilder.DropColumn(
                name: "started",
                table: "Streams");
        }
    }
}
