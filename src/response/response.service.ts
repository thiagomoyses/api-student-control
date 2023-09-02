import { Injectable } from "@nestjs/common";

@Injectable()
export class ResponseService {

    positiveResponse(payload){
        return {
            message: "Success!",
            data: payload
        }
    }
}