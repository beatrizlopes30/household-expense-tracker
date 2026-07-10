using HouseholdExpenseTracker.Api.Models;

namespace HouseholdExpenseTracker.Api.Dtos;

public record TransactionDto(Guid Id, string Description, decimal Amount, TransactionType Type, Guid PersonId, string PersonName); 
