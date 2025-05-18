import React, { useEffect, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import { User } from "lucide-react";
import { EVENTS } from "../constants/events";

const UserList = ({ roomId }) => {
  const { socket } = useSocket();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!socket || !roomId) return;

    const handleUserList = (users) => {
      setUsers(Array.isArray(users) ? users : []);
      setLoading(false);
    };

    setLoading(true);
    socket.emit(EVENTS.ROOM.GET_USERS, { roomId });
    socket.on(EVENTS.ROOM.USER_LIST, handleUserList);

    return () => {
      socket.off(EVENTS.ROOM.USER_LIST, handleUserList);
    };
  }, [socket, roomId]);

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg text-white max-h-72 overflow-y-auto">
      <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2 flex items-center gap-2">
        <User className="text-blue-500" size={20} />
        Active Users
      </h3>

      {loading ? (
        <p className="text-gray-400 italic">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-400 italic">No users currently active.</p>
      ) : (
        <ul className="space-y-3">
          {users.map((user) => (
            <li
              key={user.socketId}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700 transition-colors cursor-pointer select-none"
              title={user.username}
            >
              <User size={20} className="text-green-400" />
              <span className="font-medium truncate">{user.username}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;
