using MazeBackend.Models;
using MazeBackend.Services;
using Microsoft.AspNetCore.SignalR;
using System.Net;

namespace MazeBackend.Hubs
{
    public class MazeHub : Hub
    {
        private readonly MazeService _mazeService;
        public MazeHub(MazeService mazeService) {
            _mazeService = mazeService;
        }

        public async Task MazeUpdatev2(List<MazeCell> updatedCells)
        {
            await _mazeService.UpdateCellsAsync(updatedCells);

            await Clients.Others.SendAsync("mazeUpdatev2", updatedCells);
        }

        public async Task RequestMazeGrid()
        {
            var mazeGrid = await _mazeService.GetFlatGridAsync();

            await Clients.Caller.SendAsync("receiveMazeGrid", mazeGrid);
        }

        public async Task IsGeneratingUpdate(bool isGeneratingData)
        {
            await Clients.Others.SendAsync("isGeneratingUpdate", isGeneratingData);
        }
    }
}
