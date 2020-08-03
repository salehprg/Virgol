using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace lms_with_moodle.Migrations
{
    public partial class SchoolClassChng : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SchoolClasses");

            migrationBuilder.CreateTable(
                name: "School_Classes",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    School_Id = table.Column<int>(nullable: false),
                    Moodle_Id = table.Column<int>(nullable: false),
                    Grade_Id = table.Column<int>(nullable: false),
                    Grade_MoodleId = table.Column<int>(nullable: false),
                    ClassName = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_School_Classes", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "School_Classes");

            migrationBuilder.CreateTable(
                name: "SchoolClasses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ClassName = table.Column<string>(type: "text", nullable: true),
                    Grade_Id = table.Column<int>(type: "integer", nullable: false),
                    Grade_MoodleId = table.Column<int>(type: "integer", nullable: false),
                    Moodle_Id = table.Column<int>(type: "integer", nullable: false),
                    School_Id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SchoolClasses", x => x.Id);
                });
        }
    }
}
