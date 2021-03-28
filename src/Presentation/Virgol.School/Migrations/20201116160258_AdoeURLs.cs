using Microsoft.EntityFrameworkCore.Migrations;

namespace Virgol.Migrations
{
    public partial class AdoeURLs : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AdobeUrl",
                table: "Schools",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdobeUrl",
                table: "Schools");
        }
    }
}
