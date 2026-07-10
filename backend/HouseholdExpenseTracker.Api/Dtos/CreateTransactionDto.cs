using HouseholdExpenseTracker.Api.Models;

namespace HouseholdExpenseTracker.Api.Dtos;

public record CreateTransactionDto(string Description, decimal Amount, TransactionType Type, Guid PersonId);