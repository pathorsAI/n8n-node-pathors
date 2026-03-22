import type { IAllExecuteFunctions, IHttpRequestMethods, IDataObject, ILoadOptionsFunctions, INodePropertyOptions } from "n8n-workflow";
export declare function pathorsApiRequest(this: IAllExecuteFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, qs?: IDataObject, projectId?: string): Promise<IDataObject>;
export declare function getProjects(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
export declare function getProjectId(context: IAllExecuteFunctions, itemIndex?: number): string;
