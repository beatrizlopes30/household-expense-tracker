using HouseholdExpenseTracker.Api.Data;
using HouseholdExpenseTracker.Api.Middleware;
using HouseholdExpenseTracker.Api.Services;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

const string FrontendCorsPolicy = "FrontendCorsPolicy";

// Database

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Services
builder.Services.AddScoped<PersonService>();
builder.Services.AddScoped<TransactionService>();
builder.Services.AddScoped<TotalsService>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCorsPolicy, policy =>
        policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

// Controllers
// Returns enums as strings instead of numbers in JSON responses,
// making the API more readable for the frontend.
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "Household Expense Tracker API v1");
        options.RoutePrefix = "swagger";
    });
}

app.UseCors(FrontendCorsPolicy);
// Must run before MapControllers so it can catch exceptions thrown by any endpoint.
app.UseMiddleware<ErrorHandlingMiddleware>();
app.UseAuthorization();
app.MapControllers();

// Migrations 
// Applies migrations on startup to create and update the database automatically.
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
}

app.Run();