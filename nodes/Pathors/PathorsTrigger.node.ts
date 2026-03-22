import type {
  IHookFunctions,
  IWebhookFunctions,
  INodeType,
  INodeTypeDescription,
  IWebhookResponseData,
  IDataObject,
} from 'n8n-workflow';

import { pathorsApiRequest, getProjects, getProjectId } from './GenericFunctions';
import { projectSelectionFields } from './PathorsDescription';

export class PathorsTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Pathors Trigger',
    name: 'pathorsTrigger',
    icon: 'file:pathors.svg',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["events"].join(", ")}}',
    description: 'Triggers when events occur in a Pathors project',
    defaults: {
      name: 'Pathors Trigger',
    },
    inputs: [],
    outputs: ['main'],
    credentials: [
      {
        name: 'pathorsApi',
        required: true,
      },
    ],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        path: 'webhook',
      },
    ],
    properties: [
      ...projectSelectionFields,
      {
        displayName: 'Events',
        name: 'events',
        type: 'multiOptions',
        required: true,
        default: ['session.ended'],
        options: [
          {
            name: 'Session Started',
            value: 'session.started',
            description: 'Triggered when a new session is created',
          },
          {
            name: 'Session Ended',
            value: 'session.ended',
            description: 'Triggered when a session ends',
          },
        ],
        description: 'The events to listen for',
      },
    ],
  };

  methods = {
    loadOptions: { getProjects },
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        const projectId = getProjectId(this);
        const webhookUrl = this.getNodeWebhookUrl('default');

        try {
          const response = await pathorsApiRequest.call(
            this,
            'POST',
            '/project/{projectId}/webhooks/check',
            { url: webhookUrl } as IDataObject,
            {},
            projectId,
          );
          return response.exists === true;
        } catch {
          return false;
        }
      },

      async create(this: IHookFunctions): Promise<boolean> {
        const projectId = getProjectId(this);
        const events = this.getNodeParameter('events') as string[];
        const webhookUrl = this.getNodeWebhookUrl('default');

        const body: IDataObject = {
          url: webhookUrl,
          events,
        };

        try {
          await pathorsApiRequest.call(
            this,
            'POST',
            '/project/{projectId}/webhooks',
            body,
            {},
            projectId,
          );
          return true;
        } catch {
          return false;
        }
      },

      async delete(this: IHookFunctions): Promise<boolean> {
        const projectId = getProjectId(this);
        const webhookUrl = this.getNodeWebhookUrl('default');

        try {
          // Look up subscription ID by URL
          const checkResponse = await pathorsApiRequest.call(
            this,
            'POST',
            '/project/{projectId}/webhooks/check',
            { url: webhookUrl } as IDataObject,
            {},
            projectId,
          );

          if (!checkResponse.exists || !checkResponse.id) {
            return true; // Already removed
          }

          await pathorsApiRequest.call(
            this,
            'DELETE',
            `/project/{projectId}/webhooks/${checkResponse.id}`,
            {},
            {},
            projectId,
          );
          return true;
        } catch {
          // Ignore errors on cleanup — subscription may already be removed
          return false;
        }
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const bodyData = this.getBodyData();

    return {
      workflowData: [this.helpers.returnJsonArray(bodyData)],
    };
  }
}
