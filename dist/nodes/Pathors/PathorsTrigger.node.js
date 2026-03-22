"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PathorsTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const PathorsDescription_1 = require("./PathorsDescription");
class PathorsTrigger {
    constructor() {
        this.description = {
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
                ...PathorsDescription_1.projectSelectionFields,
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
        this.methods = {
            loadOptions: { getProjects: GenericFunctions_1.getProjects },
        };
        this.webhookMethods = {
            default: {
                async checkExists() {
                    const projectId = (0, GenericFunctions_1.getProjectId)(this);
                    const webhookUrl = this.getNodeWebhookUrl('default');
                    try {
                        const response = await GenericFunctions_1.pathorsApiRequest.call(this, 'POST', '/project/{projectId}/webhooks/check', { url: webhookUrl }, {}, projectId);
                        return response.exists === true;
                    }
                    catch {
                        return false;
                    }
                },
                async create() {
                    const projectId = (0, GenericFunctions_1.getProjectId)(this);
                    const events = this.getNodeParameter('events');
                    const webhookUrl = this.getNodeWebhookUrl('default');
                    const body = {
                        url: webhookUrl,
                        events,
                    };
                    try {
                        await GenericFunctions_1.pathorsApiRequest.call(this, 'POST', '/project/{projectId}/webhooks', body, {}, projectId);
                        return true;
                    }
                    catch {
                        return false;
                    }
                },
                async delete() {
                    const projectId = (0, GenericFunctions_1.getProjectId)(this);
                    const webhookUrl = this.getNodeWebhookUrl('default');
                    try {
                        const checkResponse = await GenericFunctions_1.pathorsApiRequest.call(this, 'POST', '/project/{projectId}/webhooks/check', { url: webhookUrl }, {}, projectId);
                        if (!checkResponse.exists || !checkResponse.id) {
                            return true;
                        }
                        await GenericFunctions_1.pathorsApiRequest.call(this, 'DELETE', `/project/{projectId}/webhooks/${checkResponse.id}`, {}, {}, projectId);
                        return true;
                    }
                    catch {
                        return false;
                    }
                },
            },
        };
    }
    async webhook() {
        const bodyData = this.getBodyData();
        return {
            workflowData: [this.helpers.returnJsonArray(bodyData)],
        };
    }
}
exports.PathorsTrigger = PathorsTrigger;
