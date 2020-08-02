using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace lms_with_moodle.Migrations
{
    public partial class schooldataupdated : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Bases",
                table: "Schools");

            migrationBuilder.DropColumn(
                name: "Grade",
                table: "Schools");

            migrationBuilder.DropColumn(
                name: "StudyFields",
                table: "Schools");

            migrationBuilder.CreateTable(
                name: "School_Bases",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Moodle_Id = table.Column<int>(nullable: false),
                    Base_Id = table.Column<int>(nullable: false),
                    School_Id = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_School_Bases", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "School_Grades",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Moodle_Id = table.Column<int>(nullable: false),
                    Grade_Id = table.Column<int>(nullable: false),
                    School_Id = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_School_Grades", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "School_StudyFields",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Moodle_Id = table.Column<int>(nullable: false),
                    StudyField_Id = table.Column<int>(nullable: false),
                    School_Id = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_School_StudyFields", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "School_Bases");

            migrationBuilder.DropTable(
                name: "School_Grades");

            migrationBuilder.DropTable(
                name: "School_StudyFields");

            migrationBuilder.AddColumn<string>(
                name: "Bases",
                table: "Schools",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Grade",
                table: "Schools",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StudyFields",
                table: "Schools",
                type: "text",
                nullable: true);
        }
    }
}
