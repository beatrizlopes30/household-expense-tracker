namespace HouseholdExpenseTracker.Api.Models;

public class Person
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Age { get; set; }
    public List<Transaction> Transactions { get; set; } = new();

    private const int MinimumAgeForIncome = 18;
    // Centralizes the age limit for minors in a single location, used for both
    // transaction validation and the interface displayed to minors.
    public bool IsMinor => Age < MinimumAgeForIncome;
}