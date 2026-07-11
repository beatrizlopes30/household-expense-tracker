using HouseholdExpenseTracker.Api.Dtos;
using HouseholdExpenseTracker.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace HouseholdExpenseTracker.Api.Controllers;

[ApiController]
[Route("api/people")]
public class PeopleController : ControllerBase
{
    private readonly PersonService _personService;

    public PeopleController(PersonService personService)
    {
        _personService = personService;
    }

    [HttpGet]
    public async Task<ActionResult<List<PersonDto>>> List()
    {
        var people = await _personService.ListAsync();
        return Ok(people);
    }

    [HttpPost]
    public async Task<ActionResult<PersonDto>> Create([FromBody] CreatePersonDto dto)
    {
        var person = await _personService.CreateAsync(dto);
        return CreatedAtAction(nameof(List), new { id = person.Id }, person);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _personService.DeleteAsync(id);
        return NoContent();
    }
}