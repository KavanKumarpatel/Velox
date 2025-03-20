import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";

const adminapi = createApi({
  reducerPath: "adminapi",
  baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/v1` }),
  tagTypes: ["dashboard"],

  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: () => ({
        url: `/admin/stats`,
        credentials: "include",
      }),
      providesTags: ["dashboard"],
    }),

    getUsersData: builder.query({
      query: () => ({
        url: `/admin/users`,
        credentials: "include",
      }),
      providesTags: ["users"],
    }),

    getChatsData: builder.query({
      query: () => ({
        url: `/admin/chats`,
        credentials: "include",
      }),
      providesTags: ["chats"],
    }),

    getMessagesData: builder.query({
      query: () => ({
        url: `/admin/messages`,
        credentials: "include",
      }),
      providesTags: ["messages"],
    }),
  }),
});

export default adminapi;

export const {
  useGetDashboardDataQuery,
  useGetChatsDataQuery,
  useGetMessagesDataQuery,
  useGetUsersDataQuery,
} = adminapi;
