using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class uniqueTitleuser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_trips_Title",
                table: "trips");

            migrationBuilder.CreateIndex(
                name: "IX_trips_Title_UserId",
                table: "trips",
                columns: new[] { "Title", "UserId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_trips_Title_UserId",
                table: "trips");

            migrationBuilder.CreateIndex(
                name: "IX_trips_Title",
                table: "trips",
                column: "Title",
                unique: true);
        }
    }
}
