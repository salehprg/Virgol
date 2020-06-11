using Microsoft.EntityFrameworkCore.Migrations;

namespace lms_with_moodle.Migrations
{
    public partial class AddDocument : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Document2",
                table: "AspNetUsers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ShDocument",
                table: "AspNetUsers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Document2",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ShDocument",
                table: "AspNetUsers");
        }
    }
}
