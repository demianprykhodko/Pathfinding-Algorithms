using MazeBackend.Data;
using MazeBackend.Hubs;
using MazeBackend.Models;
using MazeBackend.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddDbContext<MazeDbContext>(options => options.UseInMemoryDatabase("MazeDb"));
builder.Services.AddScoped<MazeService>();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR(options =>
{
    options.EnableDetailedErrors = true;
    options.MaximumReceiveMessageSize = 262144;
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder
            .WithOrigins("http://localhost:4200")
            .SetIsOriginAllowedToAllowWildcardSubdomains()
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<MazeDbContext>();
    context.Database.EnsureCreated();

    if (!context.MazeCells.Any())
    {
        int rows = 25;
        int cols = 34;
        int idCounter = 1;
        var initialCells = new List<MazeCell>();

        for (int y = 0; y < rows; y++)
        {
            for (int x = 0; x < cols; x++)
            {
                initialCells.Add(new MazeCell
                {
                    Id = idCounter++,
                    X = x,
                    Y = y,
                    IsWall = false,
                    IsStart = false,
                    IsEnd = false,
                    IsPath = false,
                    IsVisited = false
                });
            }
        }

        context.MazeCells.AddRange(initialCells);
        context.SaveChanges();
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowSpecificOrigin");

app.MapControllers();
app.MapHub<MazeHub>("/mazeHub");

app.Run();
