namespace HouseholdExpenseTracker.Api.Dtos;

public record TotalsByPersonDto(
    Guid PersonId,
    string PersonName,
    decimal TotalIncome,
    decimal TotalExpense,
    decimal Balance);