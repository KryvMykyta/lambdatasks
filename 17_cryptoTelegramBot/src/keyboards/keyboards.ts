export const addKeyboardOptions = (msgid: number) => {
  return {
    reply_to_message_id: msgid,
    reply_markup: {
      resize_keyboard: true,
      one_time_keyboard: true,
      remove_keyboard: true,
      keyboard: [[{ text: "Add to favourite" }]],
    },
  };
};

export const deleteKeyboardOptions = (msgid: number) => {
  return {
    reply_to_message_id: msgid,
    reply_markup: {
      resize_keyboard: true,
      one_time_keyboard: true,
      remove_keyboard: true,
      keyboard: [[{ text: "Delete from favourite" }]],
    },
  };
};

export const standartKeyboardOptions = () => {
  return {
    reply_markup: {
      resize_keyboard: true,
      one_time_keyboard: true,
      remove_keyboard: true,
      keyboard: [[{ text: "/listFavourite" },{ text: "/listRecent" }],[{ text: "/help" }]],
    },
  };
};
