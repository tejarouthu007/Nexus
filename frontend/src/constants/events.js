export const EVENTS = {
    CONNECTION: "connect",
    DISCONNECT: "disconnect",
  
    AUTHENTICATE: "authenticate",
  
    ROOM: {
      JOIN: "join_room",
      LEAVE: "leave_room",
      USER_JOINED: "user_joined",
      USER_LEFT: "user_left",
      USER_LIST: "user_list",
    },
  
    CODE: {
      CHANGE: "code_change",
      UPDATE: "code_update",
      CURSOR_MOVE: "cursor_move",
      CURSOR_UPDATE: "cursor_position_update",
    },
  
    EXECUTION: {
      RUN: "run_code",
      RESULT: "execution_result",
    },
  
    VERSIONING: {
      SAVE: "save_code",
      SAVED: "code_saved",
      LOAD_VERSION: "load_previous_version",
      VERSION_LOADED: "previous_version_loaded",
    },
  
    CHAT: {
      SEND_MESSAGE: "send_message",
      NEW_MESSAGE: "new_message",
      TYPING: "typing",
      STOP_TYPING: "stop_typing",
    },
  
    LOCK: {
      LOCK_CODE: "lock_code",
      CODE_LOCKED: "code_locked",
      REQUEST_EDIT: "request_edit_access",
      GRANT_EDIT: "grant_edit_access",
      EDIT_GRANTED: "edit_access_granted",
    },
  
    ERROR: "error",
    NOTIFICATION: "notification",
  };
  