using HouseholdExpenseTracker.Api.Dtos;
using HouseholdExpenseTracker.Api.Models;
using HouseholdExpenseTracker.Api.Services;
using Xunit;

namespace HouseholdExpenseTracker.Api.Tests;

public class TotalsServiceTests
{
    [Fact]
    public async Task GetTotalsAsync_CalculatesBalanceCorrectly()
    {
        var dbContext = TestDbContextFactory.Create();
        var personService = new PersonService(dbContext);
        var transactionService = new TransactionService(dbContext);
        var totalsService = new TotalsService(dbContext);

        var person = await personService.CreateAsync(new CreatePersonDto("Maria", 30));
        await transactionService.CreateAsync(new CreateTransactionDto("Salario", 3000, TransactionType.Income, person.Id));
        await transactionService.CreateAsync(new CreateTransactionDto("Mercado", 500, TransactionType.Expense, person.Id));

        var totals = await totalsService.GetTotalsAsync();

        Assert.Equal(3000, totals.TotalIncome);
        Assert.Equal(500, totals.TotalExpense);
        Assert.Equal(2500, totals.Balance);
    }

    [Fact]
    public async Task GetTotalsAsync_WithNoPeople_ReturnsZeroedTotals()
    {
        var dbContext = TestDbContextFactory.Create();
        var totalsService = new TotalsService(dbContext);

        var totals = await totalsService.GetTotalsAsync();

        Assert.Empty(totals.ByPerson);
        Assert.Equal(0, totals.Balance);
    }
}