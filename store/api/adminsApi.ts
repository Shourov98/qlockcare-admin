import { baseApi } from "@/store/api/baseApi";
import {
  mapPlatformAdmin,
  type Admin,
  type AdminCreateInput,
  type AdminListResult,
  type AdminUpdateInput,
  type PlatformAdmin,
  type PlatformAdminListResult,
} from "@/components/admins/admins";

export const adminsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listAdmins: build.query<
      AdminListResult,
      { page: number; pageSize: number; search?: string }
    >({
      query: ({ page, pageSize, search }) => {
        const query = new URLSearchParams({
          page: String(page),
          page_size: String(pageSize),
        });
        if (search?.trim()) query.set("search", search.trim());
        return `/admin/admins?${query}`;
      },
      transformResponse: (response: PlatformAdminListResult) => ({
        data: response.data.map(mapPlatformAdmin),
        pagination: response.pagination,
      }),
      providesTags: (result) => [
        "AdminList",
        ...(result?.data.map(({ id }) => ({ type: "Admin" as const, id })) ?? []),
      ],
    }),
    createAdmin: build.mutation<Admin, AdminCreateInput>({
      query: (input) => ({
        url: "/admin/admins",
        method: "POST",
        body: {
          full_name: input.name,
          email: input.email,
          phone: input.phone || null,
          scopes: input.scopes,
        },
      }),
      transformResponse: (response: PlatformAdmin) => mapPlatformAdmin(response),
      invalidatesTags: ["AdminList"],
    }),
    updateAdmin: build.mutation<Admin, { id: string; input: AdminUpdateInput }>({
      query: ({ id, input }) => {
        const body: Record<string, string | string[] | null> = {};
        if (input.name !== undefined) body.full_name = input.name;
        if (input.email !== undefined) body.email = input.email;
        if (input.phone !== undefined) body.phone = input.phone || null;
        if (input.status !== undefined) body.status = input.status;
        if (input.password) body.password = input.password;
        if (input.scopes !== undefined) body.scopes = input.scopes;
        return { url: `/admin/admins/${id}`, method: "PATCH", body };
      },
      transformResponse: (response: PlatformAdmin) => mapPlatformAdmin(response),
      invalidatesTags: (_result, _error, { id }) => ["AdminList", { type: "Admin", id }],
    }),
    deleteAdmin: build.mutation<void, string>({
      query: (id) => ({ url: `/admin/admins/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => ["AdminList", { type: "Admin", id }],
    }),
  }),
});

export const {
  useListAdminsQuery,
  useCreateAdminMutation,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
} = adminsApi;
