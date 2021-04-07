using Microsoft.EntityFrameworkCore.Migrations;

namespace Virgol.Migrations
{
    public partial class AutoFillSchool : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AutoFill",
                table: "Schools",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Autofill",
                table: "AdminDetails",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AutoFill",
                table: "Schools");

            migrationBuilder.DropColumn(
                name: "Autofill",
                table: "AdminDetails");
        }
    }
}
