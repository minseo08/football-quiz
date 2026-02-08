import { Injectable } from '@nestjs/common';

@Injectable()
export class GameService {
  private lobbyUsers = new Map<string, { id: string; name: string }>();
  private rooms = new Map<string, any>();

  addLobbyUser(socketId: string, name: string) {
    this.lobbyUsers.set(socketId, { id: socketId, name });
  }

  removeLobbyUser(socketId: string) {
    this.lobbyUsers.delete(socketId);
  }

  getLobbyData() {
    return {
      users: Array.from(this.lobbyUsers.values()),
      rooms: Array.from(this.rooms.values()),
    };
  }

  getRoom(roomId: string) {
    return this.rooms.get(roomId);
  }
  
  createRoom(hostSocketId: string, hostName: string, roomName: string, timeLimit: number) {
    const roomId = `room_${Date.now()}`;
    const newRoom = {
      id: roomId,
      name: roomName,
      host: hostSocketId,
      timeLimit: timeLimit,
      quizCount: 10,
      quizType: null,
      players: [{ id: hostSocketId, name: hostName, isReady: true }],
      gameInProgress: false,
      scores: {},
    };
    this.rooms.set(roomId, newRoom);
    return newRoom;
  }

  joinRoom(roomId: string, socketId: string, name: string) {
    const room = this.rooms.get(roomId);
    if (!room) return null;
    
    if (room.players.find(p => p.id === socketId)) return room;

    room.players.push({ id: socketId, name, isReady: false });
    return room;
  }

  toggleReady(roomId: string, socketId: string) {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const player = room.players.find(p => p.id === socketId);
    if (player && player.id !== room.host) { 
      player.isReady = !player.isReady;
    }
    return room;
  }

  selectQuizType(roomId: string, quizType: string) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.quizType = quizType;
    }
    return room;
  }

  updateTimeLimit(roomId: string, timeLimit: number) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.timeLimit = timeLimit;
      console.log(`[Room ${roomId}] 시간 설정 변경: ${timeLimit}초`);
    }
    return room;
  }

  updateQuizCount(roomId: string, quizCount: number) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.quizCount = quizCount;
      console.log(`[Room ${roomId}] 문제 개수 설정 변경: ${quizCount}개`);
    }
    return room;
  }

  getRoomByPlayerId(socketId: string) {
    return Array.from(this.rooms.values()).find(room => 
      room.players.some(p => p.id === socketId)
    );
  }

  leaveRoom(socketId: string) {
    for (const [roomId, room] of this.rooms.entries()) {
      const playerIndex = room.players.findIndex(p => p.id === socketId);
      if (playerIndex !== -1) {
        if (room.host === socketId) {
          this.rooms.delete(roomId);
          return { roomId, deleted: true };
        } else {
          room.players.splice(playerIndex, 1);
          return { roomId, deleted: false, room };
        }
      }
    }
    return null;
  }
}