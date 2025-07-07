using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class check : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_images_trip_activities_TripActivityId",
                table: "images");

            migrationBuilder.DropForeignKey(
                name: "FK_images_trips_TripId",
                table: "images");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "trips",
                type: "text",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<int>(
                name: "TripId",
                table: "images",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<int>(
                name: "TripActivityId",
                table: "images",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_images_trip_activities_TripActivityId",
                table: "images",
                column: "TripActivityId",
                principalTable: "trip_activities",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_images_trips_TripId",
                table: "images",
                column: "TripId",
                principalTable: "trips",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_images_trip_activities_TripActivityId",
                table: "images");

            migrationBuilder.DropForeignKey(
                name: "FK_images_trips_TripId",
                table: "images");

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "trips",
                type: "integer",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<int>(
                name: "TripId",
                table: "images",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "TripActivityId",
                table: "images",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_images_trip_activities_TripActivityId",
                table: "images",
                column: "TripActivityId",
                principalTable: "trip_activities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_images_trips_TripId",
                table: "images",
                column: "TripId",
                principalTable: "trips",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
