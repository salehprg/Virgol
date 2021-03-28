using Microsoft.EntityFrameworkCore.Migrations;

namespace Virgol.Migrations
{
    public partial class PrivateProperty : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // migrationBuilder.AddColumn<bool>(
            //     name: "Private",
            //     table: "Meetings",
            //     nullable: false,
            //     defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // migrationBuilder.DropColumn(
            //     name: "Private",
            //     table: "Meetings");
        }
    }
}
