"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pathors = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const PathorsDescription_1 = require("./PathorsDescription");
function parseDynamicVariables(json) {
    if (!json || json === '{}') {
        return undefined;
    }
    try {
        const parsed = JSON.parse(json);
        return Object.keys(parsed).length > 0 ? parsed : undefined;
    }
    catch {
        return undefined;
    }
}
async function executeCallCreate(context, itemIndex) {
    const projectId = (0, GenericFunctions_1.getProjectId)(context, itemIndex);
    const fromNumber = context.getNodeParameter('fromNumber', itemIndex);
    const toNumber = context.getNodeParameter('toNumber', itemIndex);
    const dynamicVariablesJson = context.getNodeParameter('dynamicVariables', itemIndex);
    const body = {
        fromNumber,
        toNumber,
    };
    const dynamicVariables = parseDynamicVariables(dynamicVariablesJson);
    if (dynamicVariables) {
        body.dynamicVariables = dynamicVariables;
    }
    return GenericFunctions_1.pathorsApiRequest.call(context, 'POST', '/project/{projectId}/integration/phone/call/outbound', body, {}, projectId);
}
class Pathors {
    constructor() {
        this.description = {
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
                PathorsDescription_1.resourceOptions,
                ...PathorsDescription_1.projectSelectionFields,
                PathorsDescription_1.callOperations,
                ...PathorsDescription_1.callCreateFields,
            ],
        };
        this.methods = {
            loadOptions: { getProjects: GenericFunctions_1.getProjects },
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        for (let i = 0; i < items.length; i++) {
            try {
                let responseData = {};
                if (resource === 'call' && operation === 'create') {
                    responseData = await executeCallCreate(this, i);
                }
                const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
                returnData.push(...executionData);
            }
            catch (error) {
                if (this.continueOnFail()) {
                    const executionData = this.helpers.constructExecutionMetaData(this.helpers.returnJsonArray({ error: error.message }), { itemData: { item: i } });
                    returnData.push(...executionData);
                    continue;
                }
                throw error;
            }
        }
        return [returnData];
    }
}
exports.Pathors = Pathors;
