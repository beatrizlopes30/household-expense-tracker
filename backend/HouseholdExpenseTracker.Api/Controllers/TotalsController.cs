using HouseholdExpenseTracker.Api.Dtos;
using HouseholdExpenseTracker.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace HouseholdExpenseTracker.Api.Controllers;

[ApiController]
[Route("api/totals")]
public class TotalsController : ControllerBase
{
    private readonly TotalsService _totalsService;

    public TotalsController(TotalsService totalsService)
    {
        _totalsService = totalsService;
    }

    [HttpGet]
    public async Task<ActionResult<ConsolidatedTotalsDto>> Get()
    {
        var totals = await _totalsService.GetTotalsAsync();
        return Ok(totals);
    }
}