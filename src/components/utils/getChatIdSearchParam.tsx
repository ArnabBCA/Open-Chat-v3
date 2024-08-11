export const getChatIdSearchParam = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const chatId = searchParams.get('chatId') || null;
  return chatId;
};
