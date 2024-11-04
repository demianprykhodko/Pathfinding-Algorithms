import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { MazeCell } from '../../models/maze-cell.model';

@Injectable({
  providedIn: "root"
})
export class SignalrService {
  private hubConnection!: signalR.HubConnection;
  public mazeUpdateSubject = new Subject<MazeCell[][]>();
  public isGeneratingUpdateSubject = new Subject<boolean>();
  public startCellSubject = new Subject<MazeCell>();
  public endCellSubject = new Subject<MazeCell>();

  constructor() { 
    this.startConnection();
    this.addListeners();
  }

  private startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7110/mazehub") // Adjust the URL to match your backend
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .catch(err => console.error("Error while starting connection: " + err));
  }

  private addListeners() {
    this.hubConnection.on("mazeUpdate", (mazeData: MazeCell[][]) => {
      this.mazeUpdateSubject.next(mazeData); // Emit the update to listeners
    });

    this.hubConnection.on("isGeneratingUpdate", (isGeneratingData: boolean) => {
      this.isGeneratingUpdateSubject.next(isGeneratingData); // Emit the update to listeners
    });

    this.hubConnection.on("receiveStartCell", (startCellData: MazeCell) => {
      this.startCellSubject.next(startCellData); // Emit the update to listeners
    });

    this.hubConnection.on("receiveEndCell", (endCellData: MazeCell) => {
      this.endCellSubject.next(endCellData); // Emit the update to listeners
    });
  }

  public sendMazeUpdate(grid: MazeCell[][]) {
    this.hubConnection.invoke("MazeUpdate", grid)
      .catch(err => console.error("Error while sending maze update: " + err));
  }

  public sendIsGeneratingUpdate(isGenerating: boolean) {
    this.hubConnection.invoke("IsGeneratingUpdate", isGenerating)
      .catch(err => console.error("Error while sending isGenerating update: " + err));  
  }

  public setStartCell(startCell: MazeCell) {
    this.hubConnection.invoke("SetStartCell", startCell)
      .catch(err => console.error("Error while sending start cell: " + err));  
  }

  public setEndCell(endCell: MazeCell) {
    this.hubConnection.invoke("SetEndCell", endCell)
      .catch(err => console.error("Error while sending start cell: " + err));  
  }
}
