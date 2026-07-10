using HouseholdExpenseTracker.Api.Data;
using HouseholdExpenseTracker.Api.Dtos;
using HouseholdExpenseTracker.Api.Models;
using HouseholdExpenseTracker.Api.Services.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace HouseholdExpenseTracker.Api.Services;

public class PersonService
{
    private readonly AppDbContext _dbContext;

    public PersonService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<PersonDto>> ListAsync()
    {
        return await _dbContext.People
            .Select(person => new PersonDto(person.Id, person.Name, person.Age))
            .ToListAsync();
    }

    public async Task<PersonDto> CreateAsync(CreatePersonDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            throw new BusinessRuleException("Name cannot be empty.");
        }

        if (dto.Age < 0 || dto.Age > 120)
        {
            throw new BusinessRuleException("Age must be between 0 and 120.");
        }

        var person = new Person
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Age = dto.Age
        };

        _dbContext.People.Add(person);
        await _dbContext.SaveChangesAsync();

        return new PersonDto(person.Id, person.Name, person.Age);
    }

    public async Task DeleteAsync(Guid id)
    {
        var person = await _dbContext.People.FindAsync(id);

        if (person is null)
        {
            throw new PersonNotFoundException(id);
        }

        _dbContext.People.Remove(person);
        await _dbContext.SaveChangesAsync();
    }
}