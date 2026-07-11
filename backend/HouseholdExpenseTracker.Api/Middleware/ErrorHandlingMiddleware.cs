using System.Text.Json;
using HouseholdExpenseTracker.Api.Services.Exceptions;

namespace HouseholdExpenseTracker.Api.Middleware;

public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;

    public ErrorHandlingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (PersonNotFoundException exception)
        {
            await WriteErrorResponseAsync(context, StatusCodes.Status404NotFound, exception.Message);
        }
        catch (BusinessRuleException exception)
        {
            await WriteErrorResponseAsync(context, StatusCodes.Status400BadRequest, exception.Message);
        }
        catch (Exception exception)
        {
            await WriteErrorResponseAsync(context, StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
            Console.Error.WriteLine(exception);
        }
    }

    private static async Task WriteErrorResponseAsync(HttpContext context, int statusCode, string message)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = statusCode;

        var body = JsonSerializer.Serialize(new { message });
        await context.Response.WriteAsync(body);
    }
}