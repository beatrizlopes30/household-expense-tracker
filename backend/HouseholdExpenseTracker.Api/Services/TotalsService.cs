using HouseholdExpenseTracker.Api.Data;
using HouseholdExpenseTracker.Api.Dtos;
using HouseholdExpenseTracker.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace HouseholdExpenseTracker.Api.Services;

public class TotalsService
{
    private readonly AppDbContext _dbContext;

    public TotalsService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ConsolidatedTotalsDto> GetTotalsAsync()
    {
        var people = await _dbContext.People
            .Include(person => person.Transactions)
            .ToListAsync();

        var byPerson = people.Select(person =>
        {
            var totalIncome = person.Transactions
                .Where(t => t.Type == TransactionType.Income)
                .Sum(t => t.Amount);

            var totalExpense = person.Transactions
                .Where(t => t.Type == TransactionType.Expense)
                .Sum(t => t.Amount);

            return new TotalsByPersonDto(
                person.Id,
                person.Name,
                totalIncome,
                totalExpense,
                totalIncome - totalExpense);
        }).ToList();

        var overallIncome = byPerson.Sum(p => p.TotalIncome);
        var overallExpense = byPerson.Sum(p => p.TotalExpense);

        return new ConsolidatedTotalsDto(
            byPerson,
            overallIncome,
            overallExpense,
            overallIncome - overallExpense);
    }
}