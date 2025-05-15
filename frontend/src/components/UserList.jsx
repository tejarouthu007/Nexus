import React, { useEffect, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import { User } from "lucide-react";
import { EVENTS } from "../constants/events";

const UserList = ({ roomId }) => {
  const [users, setUsers] = useState([]);
  const socket = useSocket().socket;

  useEffect(() => {
    if (!socket || !roomId) return;

    const handleUserList = (users) => {
      setUsers(users);
      if(!users) console.log("Hello");
    };

    socket.emit(EVENTS.ROOM.GET_USERS, { roomId });
    socket.on(EVENTS.ROOM.USER_LIST, handleUserList);
    
    return () => {
      socket.off(EVENTS.ROOM.USER_LIST, handleUserList);
    };
  }, [socket, roomId]);

  return (
    <div className="text-white overflow-auto">
      <h3 className="text-lg font-semibold mb-2">Active Users</h3>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.socketId} className="flex items-center gap-2">
            <User size={18} className="text-green-400" />
            <span>{user.username}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
