using HouseholdExpenseTracker.Api.Dtos;
using HouseholdExpenseTracker.Api.Models;
using HouseholdExpenseTracker.Api.Services;
using HouseholdExpenseTracker.Api.Services.Exceptions;
using Xunit;

namespace HouseholdExpenseTracker.Api.Tests;

public class TransactionServiceTests
{
    [Fact]
    public async Task CreateAsync_IncomeForAdult_Succeeds()
    {
        var dbContext = TestDbContextFactory.Create();
        var personService = new PersonService(dbContext);
        var transactionService = new TransactionService(dbContext);

        var adult = await personService.CreateAsync(new CreatePersonDto("Maria", 30));

        var result = await transactionService.CreateAsync(
            new CreateTransactionDto("Salario", 3000, TransactionType.Income, adult.Id));

        Assert.Equal(TransactionType.Income, result.Type);
    }

    [Fact]
    public async Task CreateAsync_IncomeForMinor_ThrowsBusinessRuleException()
    {
        var dbContext = TestDbContextFactory.Create();
        var personService = new PersonService(dbContext);
        var transactionService = new TransactionService(dbContext);

        var minor = await personService.CreateAsync(new CreatePersonDto("Joao", 15));

        await Assert.ThrowsAsync<BusinessRuleException>(() => transactionService.CreateAsync(
            new CreateTransactionDto("Mesada", 100, TransactionType.Income, minor.Id)));
    }

    [Fact]
    public async Task CreateAsync_ExpenseForMinor_Succeeds()
    {
        var dbContext = TestDbContextFactory.Create();
        var personService = new PersonService(dbContext);
        var transactionService = new TransactionService(dbContext);

        var minor = await personService.CreateAsync(new CreatePersonDto("Joao", 15));

        var result = await transactionService.CreateAsync(
            new CreateTransactionDto("Lanche", 20, TransactionType.Expense, minor.Id));

        Assert.Equal(TransactionType.Expense, result.Type);
    }

    [Fact]
    public async Task CreateAsync_WithNonExistentPerson_ThrowsPersonNotFoundException()
    {
        var dbContext = TestDbContextFactory.Create();
        var transactionService = new TransactionService(dbContext);

        await Assert.ThrowsAsync<PersonNotFoundException>(() => transactionService.CreateAsync(
            new CreateTransactionDto("Teste", 50, TransactionType.Expense, Guid.NewGuid())));
    }

    [Fact]
    public async Task CreateAsync_WithZeroAmount_ThrowsBusinessRuleException()
    {
        var dbContext = TestDbContextFactory.Create();
        var personService = new PersonService(dbContext);
        var transactionService = new TransactionService(dbContext);

        var person = await personService.CreateAsync(new CreatePersonDto("Maria", 30));

        await Assert.ThrowsAsync<BusinessRuleException>(() => transactionService.CreateAsync(
            new CreateTransactionDto("Teste", 0, TransactionType.Expense, person.Id)));
    }
}