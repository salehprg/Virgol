﻿using Microsoft.EntityFrameworkCore.Migrations;

namespace lms_with_moodle.Migrations
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
