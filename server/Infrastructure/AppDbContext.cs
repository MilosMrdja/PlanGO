namespace Infrastructure
{
    using Domain.Entities;
    using Microsoft.EntityFrameworkCore;

    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Domain.Entities.Image> Images { get; set; }
        public DbSet<Rating> Ratings { get; set; }
        public DbSet<TripActivity> TripActivities { get; set; }
        public DbSet<Trip> Trips { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<Account>()
                .HasIndex(a => a.Email)
                .IsUnique();

            modelBuilder.Entity<Trip>()
                .HasIndex(e => new { e.Title, e.UserId })
                .IsUnique();

            modelBuilder.Entity<Trip>()
                .Property(t => t.IsArchive)
                .HasDefaultValue(false);
                

            // User - Account
            modelBuilder.Entity<User>()
             .HasOne(u => u.Account)
             .WithOne(a => a.User)
             .HasForeignKey<Account>(a => a.UserId)
             .IsRequired();

            // User - Trip
            modelBuilder.Entity<User>()
                .HasMany(u => u.Trips)
                .WithOne(t => t.User)
                .HasForeignKey(t => t.UserId);


            // Image - Trip
            modelBuilder.Entity<Domain.Entities.Image>()
                .HasOne<Trip>()
                .WithMany(t => t.Images)
                .HasForeignKey(i => i.TripId);

            // Image - TripActivity
            modelBuilder.Entity<Domain.Entities.Image>()
                .HasOne<TripActivity>()
                .WithMany(t => t.Images)
                .HasForeignKey(i => i.TripActivityId);


            modelBuilder.Entity<Location>()
                .Property(l => l.Coordinates)
                .HasColumnType("geometry(Point, 4326)");

            // Rating - Trip
            modelBuilder.Entity<Rating>()
                .HasOne<Trip>()
                .WithOne(t => t.Rating)
                .HasForeignKey<Rating>(e => e.TripId)
                .IsRequired();

            // Trip - Location
            modelBuilder.Entity<Trip>()
                .HasOne(e => e.Location)
                .WithMany()
                .HasForeignKey(e => e.LocationId)
                .IsRequired(false);
            // Trip activity - Location
            modelBuilder.Entity<TripActivity>()
                .HasOne(e => e.Location)
                .WithMany()
                .HasForeignKey(e => e.LocationId)
                .IsRequired(false);

            // Trip - Trip activities
            modelBuilder.Entity<Trip>()
                .HasMany(e => e.TripActivities)
                .WithOne()
                .HasForeignKey(e => e.TripId);

            modelBuilder.Entity<Trip>()
                .Property(t => t.Status)
                .HasConversion<string>();

            modelBuilder.Entity<TripActivity>()
                .Property(r => r.Status)
                .HasConversion<string>();


        }
    }
}
