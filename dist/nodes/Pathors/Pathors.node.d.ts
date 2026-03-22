import type { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { getProjects } from './GenericFunctions';
export declare class Pathors implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: {
            getProjects: typeof getProjects;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
