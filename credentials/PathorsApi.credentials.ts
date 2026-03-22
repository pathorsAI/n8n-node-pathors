import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from "n8n-workflow";

export class PathorsApi implements ICredentialType {
  name = "pathorsApi";
  displayName = "Pathors API";
  documentationUrl = "https://docs.pathors.com/en/api-reference";
  properties: INodeProperties[] = [
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

  authenticate: IAuthenticateGeneric = {
    type: "generic",
    properties: {
      headers: {
        Authorization: "=Bearer {{$credentials.apiKey}}",
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: "https://api.pathors.com",
      url: "/v1/projects",
      method: "GET",
    },
  };
}
