import { httpClient } from "@/lib";

const getRoomTypes = async (params: PaginationQuery<RoomType>): Promise<PaginationResponse<RoomType>> => {
  const { page, size, ...filters } = params;
  return httpClient
    .get<PaginationResponse<RoomType>>("/warehouse/storage-type", {
      params: { offset: page * size, size, ...filters },
    })
    .then((res) => res.data);
};

const getRoomType = async (id: string): Promise<RoomType> => {
  return httpClient.get<RoomType>(`/warehouse/storage-type/${id}`).then((res) => res.data);
};

const createRoomType = async (request: CreateRoomTypeRequest): Promise<RoomType> => {
  return httpClient.post<RoomType>("/warehouse/storage-type/create", request).then((res) => res.data);
};

const updateRoomType = async (id: string, request: UpdateRoomTypeRequest): Promise<RoomType> => {
  return httpClient.put<RoomType>(`/warehouse/storage-type/update/${id}`, request).then((res) => res.data);
};

export const RoomTypeService = {
  getRoomTypes,
  getRoomType,
  createRoomType,
  updateRoomType,
};
