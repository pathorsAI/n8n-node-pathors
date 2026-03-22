"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callCreateFields = exports.callOperations = exports.resourceOptions = exports.projectSelectionFields = void 0;
exports.projectSelectionFields = [
    {
        displayName: 'Project Selection',
        name: 'projectSelectionMode',
        type: 'options',
        options: [
            {
                name: 'From Dropdown',
                value: 'dropdown',
            },
            {
                name: 'Manual Input',
                value: 'manual',
            },
        ],
        default: 'dropdown',
        description: 'How to select the project',
    },
    {
        displayName: 'Project',
        name: 'projectIdDropdown',
        type: 'options',
        typeOptions: {
            loadOptionsMethod: 'getProjects',
        },
        required: true,
        default: '',
        description: 'The Pathors project',
        displayOptions: {
            show: {
                projectSelectionMode: ['dropdown'],
            },
        },
    },
    {
        displayName: 'Project ID',
        name: 'projectIdManual',
        type: 'string',
        required: true,
        default: '',
        placeholder: 'pathors-project-id',
        description: 'The Pathors Project ID',
        displayOptions: {
            show: {
                projectSelectionMode: ['manual'],
            },
        },
    },
];
exports.resourceOptions = {
    displayName: 'Resource',
    name: 'resource',
    type: 'options',
    noDataExpression: true,
    options: [
        {
            name: 'Call',
            value: 'call',
            description: 'Manage phone calls',
        },
    ],
    default: 'call',
};
exports.callOperations = {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
        show: {
            resource: ['call'],
        },
    },
    options: [
        {
            name: 'Create',
            value: 'create',
            description: 'Create an outbound call',
            action: 'Create an outbound call',
        },
    ],
    default: 'create',
};
exports.callCreateFields = [
    {
        displayName: 'From Number',
        name: 'fromNumber',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['call'],
                operation: ['create'],
            },
        },
        default: '',
        placeholder: '+14155551234',
        description: 'The source phone number configured in your project with active outbound SIP status',
    },
    {
        displayName: 'To Number',
        name: 'toNumber',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['call'],
                operation: ['create'],
            },
        },
        default: '',
        placeholder: '+14155555678',
        description: 'The destination phone number in E.164 format (e.g., +14155555678)',
    },
    {
        displayName: 'Dynamic Variables',
        name: 'dynamicVariables',
        type: 'json',
        displayOptions: {
            show: {
                resource: ['call'],
                operation: ['create'],
            },
        },
        default: '{}',
        description: 'Custom variables to personalize the call flow (JSON object)',
    },
];
