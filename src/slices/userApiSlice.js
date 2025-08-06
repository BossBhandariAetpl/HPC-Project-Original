import { apiSlice } from "./apiSlice";

const USERS_URL = "/api/users";

//this will inject in the endpoint in the apiSlice endpoint key
export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    })
  }),
});

export const { useLoginMutation, useLogoutMutation, useRegisterMutation, useUpdateMutation } = usersApiSlice;