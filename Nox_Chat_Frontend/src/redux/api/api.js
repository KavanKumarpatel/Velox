import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/v1` }),
  tagTypes: ["Chat", "User", "Message", "Groups", "ChatProfile"],

  endpoints: (builder) => ({
    myChats: builder.query({
      query: (name) => ({
        url: `/chat/chats?name=${name}`,
        credentials: "include",
      }),
      providesTags: ["Chat"],
    }),

    searchUser: builder.query({
      query: (name) => ({
        url: `/user/search?name=${name}`,
        credentials: "include",
      }),
      providesTags: ["User"],
    }),

    sendRequest: builder.mutation({
      query: (_id) => ({
        url: "/user/sendrequest",
        method: "PUT",
        credentials: "include",
        body: {
          userId: _id,
        },
      }),
      invalidatesTags: ["User"],
    }),

    fetchRequests: builder.query({
      query: () => ({
        url: "/user/notifications",
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),

    updateProfile: builder.mutation({
      query: (arg) => ({
        url: "/user/updateprofiledata",
        method: "PUT",
        credentials: "include",
        body: arg,
      }),
      invalidatesTags: ["User"],
    }),

    updateProfilePicture: builder.mutation({
      query: (formdata) => ({
        url: "/user/updateprofilepicture",
        method: "PUT",
        credentials: "include",
        body: formdata,
      }),
      invalidatesTags: ["User"],
    }),

    requestResponse: builder.mutation({
      query: (data) => ({
        url: "/user/acceptrequest",
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),

    fetchUserFriends: builder.query({
      query: ({ name, chatid }) => {
        let cururl = `/user/userfriends?name=${name}`;
        if (chatid) {
          cururl = `/user/userfriends?name=${name}&&chatid=${chatid}`;
        }
        return {
          url: cururl,
          credentials: "include",
        };
      },
      providesTags: ["Groups"],
    }),

    createGroup: builder.mutation({
      query: (formdata) => ({
        url: "/chat/createGroup",
        method: "POST",
        credentials: "include",
        body: formdata,
      }),
      invalidatesTags: ["Chat"],
    }),

    getChatDetails: builder.query({
      query: ({ chatid, populate = true }) => {
        let url = `/chat/${chatid}`;
        if (populate) url += "?populate=true";

        return {
          url,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["Chat"],
    }),

    getMessages: builder.query({
      query: ({ chatid, page }) => ({
        url: `/chat/messages/${chatid}?page=${page}`,
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),

    sendAttachments: builder.mutation({
      query: (formdata) => ({
        url: "/chat/sendattachments",
        method: "POST",
        credentials: "include",
        body: formdata,
      }),
    }),

    getGroups: builder.query({
      query: () => ({
        url: `/chat/groups`,
        credentials: "include",
      }),
      providesTags: ["Groups"],
    }),

    addMembers: builder.mutation({
      query: (formdata) => ({
        url: "/chat/addmembers",
        method: "PUT",
        credentials: "include",
        body: formdata,
      }),
      invalidatesTags: ["Chat", "Groups"],
    }),

    removeMembers: builder.mutation({
      query: (formdata) => ({
        url: "/chat/removemembers",
        method: "DELETE",
        credentials: "include",
        body: formdata,
      }),
      invalidatesTags: ["Chat", "Groups"],
    }),

    exitGroup: builder.query({
      query: (chatid) => ({
        url: `/chat/leave/${chatid}`,
        credentials: "include",
      }),
      invalidatesTags: ["Chat", "Groups"],
    }),

    updateGroupInfo: builder.mutation({
      query: ({ formdata, chatid }) => ({
        url: `/chat/${chatid}`,
        method: "POST",
        credentials: "include",
        body: formdata,
      }),
      invalidatesTags: ["Chat", "Groups"],
    }),

    deleteChat: builder.mutation({
      query: (chatid) => ({
        url: `/chat/${chatid}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Chat", "Groups"],
    }),

    getChatProfileData: builder.query({
      query: (chatid) => ({
        url: `/chat/getchatprofiledata/${chatid}`,
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),

    getLastMessageTime: builder.query({
      query: (chatid) => ({
        url: `/chat/getlastmessagetime/${chatid}`,
        credentials: "include",
      }),
      invalidatesTags: ["LastMessage"],
    }),

    changeMessageToOnline: builder.query({
      query: (ˀ) => ({
        url: `/chat/changemessagetoonline`,
        credentials: "include",
      }),
      invalidatesTags: [],
    }),

    changeMessageToSeen: builder.query({
      query: (chatid) => ({
        url: `/chat/changemessagetoseen/${chatid}`,
        credentials: "include",
      }),
      invalidatesTags: [],
    }),
  }),
});

export default api;

export const {
  useMyChatsQuery,
  useLazySearchUserQuery,
  useSendRequestMutation,
  useFetchRequestsQuery,
  useUpdateProfileMutation,
  useUpdateProfilePictureMutation,
  useRequestResponseMutation,
  useLazyFetchUserFriendsQuery,
  useCreateGroupMutation,
  useGetChatDetailsQuery,
  useGetMessagesQuery,
  useSendAttachmentsMutation,
  useGetGroupsQuery,
  useAddMembersMutation,
  useRemoveMembersMutation,
  useLazyExitGroupQuery,
  useUpdateGroupInfoMutation,
  useDeleteChatMutation,
  useLazyGetChatProfileDataQuery,
  useGetLastMessageTimeQuery,
  useLazyChangeMessageToOnlineQuery,
  useLazyChangeMessageToSeenQuery,
} = api;
