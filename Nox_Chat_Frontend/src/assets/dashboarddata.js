export const dashboardData = {
  users: [
    {
      name: "John",
      avatar: "https://randomuser.me/api/portraits/men/6.jpg",
      username: "john123",
      _id: "1",
      friends: 20,
      groups: 5,
    },
    {
      name: "Sam",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      username: "sam123",
      _id: "2",
      friends: 10,
      groups: 3,
    },
  ],

  chats: [
    {
      name: "Group X",
      _id: "group123",
      avatar: "https://randomuser.me/api/portraits/men/7.jpg",
      totalMembers: "3",
      members: [
        {
          _id: "5",
          avatar: "https://randomuser.me/api/portraits/men/8.jpg",
        },
        {
          _id: "6",
          avatar: "https://randomuser.me/api/portraits/men/9.jpg",
        },
        {
          _id: "7",
          avatar: "https://randomuser.me/api/portraits/men/10.jpg",
        },
      ],
      totalMessages: "34",
      creator: {
        name: "Sam",
        avatar: "https://randomuser.me/api/portraits/men/13.jpg",
      },
    },
  ],

  messages: [
    {
      attachments:  [{
         name: 'Marry Jane',
         avatar: "https://randomuser.me/api/portraits/men/15.jpg",
        },
         {
         name: 'Marry Jane',
         avatar: "https://randomuser.me/api/portraits/men/19.jpg",
        },
      ],
      content: "Hi I am good!",
      _id: "sam123",
      sender: {
        _id: "user._id",
        name: "Sam",
        avatar: "https://randomuser.me/api/portraits/men/14.jpg",
      },
      chat: "chatid",
      groupChat: true,
      createdAt: "2024-02-12T10:41:30.630Z",
    },
    {
      attachments:  [{
         name: 'Marry Jane',
         avatar: "https://randomuser.me/api/portraits/men/21.jpg",
        },
      ],
      content: "Hi I am good!",
      _id: "john123",
      sender: {
        _id: "3iauhtid",
        name: "John",
        avatar: "https://randomuser.me/api/portraits/men/14.jpg",
      },
      chat: "chatid",
      groupChat: false,
      createdAt: "2024-02-12T10:41:30.630Z",
    },
  ],
};