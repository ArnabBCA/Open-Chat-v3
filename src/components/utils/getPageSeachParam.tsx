export const getPageSearchParam = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const page = searchParams.get('page') || 'chats';
  if (page !== 'chats' && page !== 'addNewContact' && page !== 'notification') {
    return 'chats';
  }
  return page;
};
