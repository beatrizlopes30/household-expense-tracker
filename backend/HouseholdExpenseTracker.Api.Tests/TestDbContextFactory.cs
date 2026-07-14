using HouseholdExpenseTracker.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace HouseholdExpenseTracker.Api.Tests;

// Creates a fresh, isolated in-memory database for each test,
// so tests never interfere with one another.
public static class TestDbContextFactory
{
    public static AppDbContext Create()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }
}