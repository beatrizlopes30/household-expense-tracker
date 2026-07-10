namespace HouseholdExpenseTracker.Api.Dtos;

public record ConsolidatedTotalsDto(
    List<TotalsByPersonDto> ByPerson,
    decimal TotalIncome,
    decimal TotalExpense,
    decimal Balance);