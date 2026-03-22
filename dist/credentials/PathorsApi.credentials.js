"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PathorsApi = void 0;
class PathorsApi {
    constructor() {
        this.name = "pathorsApi";
        this.displayName = "Pathors API";
        this.documentationUrl = "https://docs.pathors.com/en/api-reference";
        this.properties = [
            {
                displayName: "API Key",
                name: "apiKey",
                type: "string",
                typeOptions: { password: true },
                default: "",
                required: true,
                description: "Your Pathors project API key (starts with sk_)",
            },
        ];
        this.authenticate = {
            type: "generic",
            properties: {
                headers: {
                    Authorization: "=Bearer {{$credentials.apiKey}}",
                },
            },
        };
        this.test = {
            request: {
                baseURL: "http://localhost:8080",
                url: "/v1/projects",
                method: "GET",
            },
        };
    }
}
exports.PathorsApi = PathorsApi;
