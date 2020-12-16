using Microsoft.EntityFrameworkCore.Migrations;

namespace lms_with_moodle.Migrations
{
    public partial class NewConfig5 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ClassWeeklySchedules_MixedSchedules_MixedId",
                table: "ClassWeeklySchedules");

            migrationBuilder.DropIndex(
                name: "IX_ClassWeeklySchedules_MixedId",
                table: "ClassWeeklySchedules");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_ClassWeeklySchedules_MixedId",
                table: "ClassWeeklySchedules",
                column: "MixedId");

            migrationBuilder.AddForeignKey(
                name: "FK_ClassWeeklySchedules_MixedSchedules_MixedId",
                table: "ClassWeeklySchedules",
                column: "MixedId",
                principalTable: "MixedSchedules",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
