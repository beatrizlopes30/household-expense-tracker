using HouseholdExpenseTracker.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace HouseholdExpenseTracker.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Person> People => Set<Person>();
    public DbSet<Transaction> Transactions => Set<Transaction>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
    // Cascade delete removes related transactions automatically
        modelBuilder.Entity<Transaction>()
            .HasOne(transaction => transaction.Person)
            .WithMany(person => person.Transactions)
            .HasForeignKey(transaction => transaction.PersonId)
            .OnDelete(DeleteBehavior.Cascade);
    // Fixed precision avoids money rounding errors
        modelBuilder.Entity<Transaction>()
            .Property(transaction => transaction.Amount)
            .HasPrecision(18, 2);
    }
}