using Microsoft.EntityFrameworkCore.Migrations;

namespace Virgol.Migrations
{
    public partial class ExInclude : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ExcludeUser",
                table: "ServicePrices",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OnlyUser",
                table: "ServicePrices",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExcludeUser",
                table: "ServicePrices");

            migrationBuilder.DropColumn(
                name: "OnlyUser",
                table: "ServicePrices");

        }
    }
}
