using Microsoft.EntityFrameworkCore.Migrations;

namespace Virgol.Migrations
{
    public partial class SchoolDefSlide : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DefaultSlideURL",
                table: "Schools",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DefaultSlideURL",
                table: "Schools");
        }
    }
}
