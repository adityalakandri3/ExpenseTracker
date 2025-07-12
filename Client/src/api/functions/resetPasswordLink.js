import { axiosInstance } from "../axiosInstance/axiosInstance"
import { endPoints } from "../endPoints/endPoint"

export const resetPasswordLink =async(email)=>{
    try {
        const {data} = await axiosInstance.post(endPoints.user.sendResetLink,email);
        console.log("From axios",data);
        return data
    } catch (error) {
        console.log(error.message);
    }
}