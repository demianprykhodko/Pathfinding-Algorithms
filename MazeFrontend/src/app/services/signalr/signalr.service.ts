import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { MazeCell } from '../../models/maze-cell.model';

@Injectable({
  providedIn: "root"
})
export class SignalrService {
  private hubConnection!: signalR.HubConnection;
  public mazeUpdateV2Subject = new Subject<MazeCell[]>();
  public isGeneratingUpdateSubject = new Subject<boolean>();

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
      .then(() => {
        this.requestMazeGrid();
      })
      .catch(err => console.error("Error while starting connection: " + err));
  }

  private addListeners() {
    this.hubConnection.on("mazeUpdatev2", (mazeData: MazeCell[]) => {
      this.mazeUpdateV2Subject.next(mazeData); // Emit the update to listeners
    });

    this.hubConnection.on("receiveMazeGrid", (mazeGrid: any) => {
      this.mazeUpdateV2Subject.next(mazeGrid); // Emit the update to listeners
    });

    this.hubConnection.on("isGeneratingUpdate", (isGeneratingData: boolean) => {
      this.isGeneratingUpdateSubject.next(isGeneratingData); // Emit the update to listeners
    });
  }

  public sendMazeUpdatev2(updatedCells: MazeCell[]) {
    this.hubConnection.invoke("MazeUpdatev2", updatedCells)
      .catch(err => console.error("Error while sending maze update: " + err));
  }

  public requestMazeGrid() {
    this.hubConnection.invoke("RequestMazeGrid")
      .catch(err => console.error("Error while sending maze update: " + err));
  }

  public sendIsGeneratingUpdate(isGenerating: boolean) {
    this.hubConnection.invoke("IsGeneratingUpdate", isGenerating)
      .catch(err => console.error("Error while sending isGenerating update: " + err));  
  }
}
