import { http } from '../ApiClient.ts';



export const selectCamppingList = () => {
    console.log("안녕하세요")
    return http.post("/home/selectCamppingList");
};
