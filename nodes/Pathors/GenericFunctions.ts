import type {
  IAllExecuteFunctions,
  IHttpRequestMethods,
  IHttpRequestOptions,
  IDataObject,
  ILoadOptionsFunctions,
  INodePropertyOptions,
  JsonObject,
} from "n8n-workflow";
import { NodeApiError } from "n8n-workflow";

export async function pathorsApiRequest(
  this: IAllExecuteFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject = {},
  qs: IDataObject = {},
  projectId?: string,
): Promise<IDataObject> {
  const baseUrl = "https://api.pathors.com";

  // Replace {projectId} placeholder in endpoint
  const resolvedEndpoint = projectId
    ? endpoint.replace("{projectId}", projectId)
    : endpoint;

  const options: IHttpRequestOptions = {
    method,
    url: `${baseUrl}${resolvedEndpoint}`,
    headers: {
      "Content-Type": "application/json",
    },
    body,
    qs,
    json: true,
  };

  if (Object.keys(body).length === 0) {
    delete options.body;
  }

  if (Object.keys(qs).length === 0) {
    delete options.qs;
  }

  try {
    const response = await this.helpers.httpRequestWithAuthentication.call(
      this,
      "pathorsApi",
      options,
    );
    return response as IDataObject;
  } catch (error) {
    throw new NodeApiError(this.getNode(), error as JsonObject, {
      message: getErrorMessage(error),
    });
  }
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return "An unknown error occurred";
}

export async function getProjects(
  this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
  const response = await pathorsApiRequest.call(this, "GET", "/v1/projects");
  const data = (response.data ?? []) as Array<{ id: string; name: string }>;
  return data.map((p) => ({
    name: p.name,
    value: p.id,
  }));
}

export function getProjectId(
  context: IAllExecuteFunctions,
  itemIndex?: number,
): string {
  const mode = context.getNodeParameter(
    "projectSelectionMode",
    itemIndex ?? 0,
  ) as string;
  return mode === "manual"
    ? (context.getNodeParameter("projectIdManual", itemIndex ?? 0) as string)
    : (context.getNodeParameter("projectIdDropdown", itemIndex ?? 0) as string);
}
