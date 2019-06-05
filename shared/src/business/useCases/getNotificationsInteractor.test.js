const { getNotifications } = require('./getNotificationsInteractor');

describe('getWorkItemsForUser', () => {
  let applicationContext;

  it('returns an unread count for my messages', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => ({
        userId: 'abc',
      }),
      getPersistenceGateway: () => ({
        getWorkItemsForUser: () => [
          {
            isInternal: true,
            isRead: false,
          },
        ],
      }),
    };
    const result = await getNotifications({
      applicationContext,
      userId: 'docketclerk',
    });
    expect(result).toEqual({ myInboxUnreadCount: 1, qcUnreadCount: 0 });
  });

  it('returns an unread count for qc messages', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => ({
        userId: 'abc',
      }),
      getPersistenceGateway: () => ({
        getWorkItemsForUser: () => [
          {
            isInternal: false,
            isRead: false,
          },
        ],
      }),
    };
    const result = await getNotifications({
      applicationContext,
      userId: 'docketclerk',
    });
    expect(result).toEqual({ myInboxUnreadCount: 0, qcUnreadCount: 1 });
  });

  it('returns an accurate unread count for legacy items marked complete', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => ({
        userId: 'abc',
      }),
      getPersistenceGateway: () => ({
        getWorkItemsForUser: () => [
          {
            isInternal: true,
            isRead: true,
          },
        ],
      }),
    };
    const result = await getNotifications({
      applicationContext,
      userId: 'docketclerk',
    });
    expect(result).toEqual({ myInboxUnreadCount: 0, qcUnreadCount: 0 });
  });
});
