import { PayloadSchema } from "@/Model/models";
import api from "@/services/api/api";

export async function getPayload() {
    try {
        const rep = await api.get("/autenticacao/me")
        const rawData = rep.data.user || rep.data;
        const { iat, exp, ...payloadLimpo } = rawData

        return payloadLimpo as PayloadSchema

    } catch (error: any) {
        if (error.response?.status == 401) return 401
        return error
    }

}