using HouseholdExpenseTracker.Api.Dtos;
using HouseholdExpenseTracker.Api.Services;
using HouseholdExpenseTracker.Api.Services.Exceptions;
using Xunit;

namespace HouseholdExpenseTracker.Api.Tests;

public class PersonServiceTests
{
    [Fact]
    public async Task CreateAsync_WithValidData_CreatesPerson()
    {
        var dbContext = TestDbContextFactory.Create();
        var service = new PersonService(dbContext);

        var result = await service.CreateAsync(new CreatePersonDto("Maria", 30));

        Assert.Equal("Maria", result.Name);
        Assert.Equal(30, result.Age);
        Assert.NotEqual(Guid.Empty, result.Id);
    }

    [Fact]
    public async Task CreateAsync_WithEmptyName_ThrowsBusinessRuleException()
    {
        var dbContext = TestDbContextFactory.Create();
        var service = new PersonService(dbContext);

        await Assert.ThrowsAsync<BusinessRuleException>(
            () => service.CreateAsync(new CreatePersonDto("", 30)));
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(121)]
    public async Task CreateAsync_WithInvalidAge_ThrowsBusinessRuleException(int invalidAge)
    {
        var dbContext = TestDbContextFactory.Create();
        var service = new PersonService(dbContext);

        await Assert.ThrowsAsync<BusinessRuleException>(
            () => service.CreateAsync(new CreatePersonDto("Maria", invalidAge)));
    }

    [Fact]
    public async Task DeleteAsync_WithNonExistentId_ThrowsPersonNotFoundException()
    {
        var dbContext = TestDbContextFactory.Create();
        var service = new PersonService(dbContext);

        await Assert.ThrowsAsync<PersonNotFoundException>(
            () => service.DeleteAsync(Guid.NewGuid()));
    }

    [Fact]
    public async Task ListAsync_ReturnsAllCreatedPeople()
    {
        var dbContext = TestDbContextFactory.Create();
        var service = new PersonService(dbContext);

        await service.CreateAsync(new CreatePersonDto("Maria", 30));
        await service.CreateAsync(new CreatePersonDto("Joao", 15));

        var result = await service.ListAsync();

        Assert.Equal(2, result.Count);
    }
}