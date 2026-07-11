using HouseholdExpenseTracker.Api.Dtos;
using HouseholdExpenseTracker.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace HouseholdExpenseTracker.Api.Controllers;

[ApiController]
[Route("api/transactions")]
public class TransactionsController : ControllerBase
{
    private readonly TransactionService _transactionService;

    public TransactionsController(TransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    [HttpGet]
    public async Task<ActionResult<List<TransactionDto>>> List()
    {
        var transactions = await _transactionService.ListAsync();
        return Ok(transactions);
    }

    [HttpPost]
    public async Task<ActionResult<TransactionDto>> Create([FromBody] CreateTransactionDto dto)
    {
        var transaction = await _transactionService.CreateAsync(dto);
        return StatusCode(StatusCodes.Status201Created, transaction);
    }
}