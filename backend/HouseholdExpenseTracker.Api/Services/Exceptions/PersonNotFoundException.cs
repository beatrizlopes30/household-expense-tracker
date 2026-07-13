namespace HouseholdExpenseTracker.Api.Services.Exceptions;

public class PersonNotFoundException : Exception
{
    public PersonNotFoundException(Guid id) : base($"Pessoa não foi encontrada.") { }
}