import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IDataObject,
} from 'n8n-workflow';

import { pathorsApiRequest, getProjects, getProjectId } from './GenericFunctions';
import {
  projectSelectionFields,
  resourceOptions,
  callOperations,
  callCreateFields,
} from './PathorsDescription';

function parseDynamicVariables(json: string): IDataObject | undefined {
  if (!json || json === '{}') {
    return undefined;
  }
  try {
    const parsed = JSON.parse(json);
    return Object.keys(parsed).length > 0 ? parsed : undefined;
  } catch {
    return undefined;
  }
}

async function executeCallCreate(
  context: IExecuteFunctions,
  itemIndex: number,
): Promise<IDataObject> {
  const projectId = getProjectId(context, itemIndex);
  const fromNumber = context.getNodeParameter('fromNumber', itemIndex) as string;
  const toNumber = context.getNodeParameter('toNumber', itemIndex) as string;
  const dynamicVariablesJson = context.getNodeParameter('dynamicVariables', itemIndex) as string;

  const body: IDataObject = {
    fromNumber,
    toNumber,
  };

  const dynamicVariables = parseDynamicVariables(dynamicVariablesJson);
  if (dynamicVariables) {
    body.dynamicVariables = dynamicVariables;
  }

  return pathorsApiRequest.call(
    context,
    'POST',
    '/project/{projectId}/integration/phone/call/outbound',
    body,
    {},
    projectId,
  );
}

export class Pathors implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Pathors',
    name: 'pathors',
    icon: 'file:pathors.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with Pathors API',
    defaults: {
      name: 'Pathors',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'pathorsApi',
        required: true,
      },
    ],
    properties: [
      resourceOptions,
      ...projectSelectionFields,
      callOperations,
      ...callCreateFields,
    ],
  };

  methods = {
    loadOptions: { getProjects },
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData: IDataObject = {};

        if (resource === 'call' && operation === 'create') {
          responseData = await executeCallCreate(this, i);
        }

        const executionData = this.helpers.constructExecutionMetaData(
          this.helpers.returnJsonArray(responseData),
          { itemData: { item: i } },
        );
        returnData.push(...executionData);
      } catch (error) {
        if (this.continueOnFail()) {
          const executionData = this.helpers.constructExecutionMetaData(
            this.helpers.returnJsonArray({ error: (error as Error).message }),
            { itemData: { item: i } },
          );
          returnData.push(...executionData);
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
