using HouseholdExpenseTracker.Api.Data;
using HouseholdExpenseTracker.Api.Dtos;
using HouseholdExpenseTracker.Api.Models;
using HouseholdExpenseTracker.Api.Services.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace HouseholdExpenseTracker.Api.Services;

public class TransactionService
{
    private readonly AppDbContext _dbContext;

    public TransactionService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<TransactionDto>> ListAsync()
    {
        return await _dbContext.Transactions
            .Include(transaction => transaction.Person)
            .Select(transaction => new TransactionDto(
                transaction.Id,
                transaction.Description,
                transaction.Amount,
                transaction.Type,
                transaction.PersonId,
                transaction.Person!.Name))
            .ToListAsync();
    }

    public async Task<TransactionDto> CreateAsync(CreateTransactionDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Description))
        {
            throw new BusinessRuleException("A descrição não pode estar vazia.");
        }

        if (dto.Amount <= 0)
        {
            throw new BusinessRuleException("O valor da transação deve ser maior que zero.");
        }

        var person = await _dbContext.People.FindAsync(dto.PersonId);

        if (person is null)
        {
            throw new PersonNotFoundException(dto.PersonId);
        }

        if (person.IsMinor && dto.Type == TransactionType.Income)
        {
            throw new BusinessRuleException(
                $"{person.Name} é menor de idade. Apenas despesas podem ser cadastradas.");
        }

        var transaction = new Transaction
        {
            Id = Guid.NewGuid(),
            Description = dto.Description,
            Amount = dto.Amount,
            Type = dto.Type,
            PersonId = dto.PersonId
        };

        _dbContext.Transactions.Add(transaction);
        await _dbContext.SaveChangesAsync();

        return new TransactionDto(transaction.Id, transaction.Description, transaction.Amount, transaction.Type, transaction.PersonId, person.Name);
    }
}