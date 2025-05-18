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
      GET_USERS: "get_users",
    },
  
    CODE: {
      CHANGE: "code_change",
      UPDATE: "code_update",
      CURSOR_MOVE: "cursor_move",
      CURSOR_UPDATE: "cursor_position_update",
      LANG_CHANGE: "lang_change",
      LANG_UPDATE: "lang_update",
    },
    FILE: {
      SYNC_REQUEST: "sync_request",
      SYNC_RESPONSE: "sync_response",
      SYNC: "sync_files",
      NEW_FILE: "new_file",
      SYNC_NEW_FILE: "sync_new_file",
      FILE_DELETED: "delete_file",
      FILE_RENAMED: "rename_file"
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
  