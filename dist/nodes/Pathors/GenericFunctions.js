"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathorsApiRequest = pathorsApiRequest;
exports.getProjects = getProjects;
exports.getProjectId = getProjectId;
const n8n_workflow_1 = require("n8n-workflow");
async function pathorsApiRequest(method, endpoint, body = {}, qs = {}, projectId) {
    const baseUrl = "http://localhost:8080";
    const resolvedEndpoint = projectId
        ? endpoint.replace("{projectId}", projectId)
        : endpoint;
    const options = {
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
        const response = await this.helpers.httpRequestWithAuthentication.call(this, "pathorsApi", options);
        return response;
    }
    catch (error) {
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error, {
            message: getErrorMessage(error),
        });
    }
}
function getErrorMessage(error) {
    if (error && typeof error === "object" && "message" in error) {
        return String(error.message);
    }
    return "An unknown error occurred";
}
async function getProjects() {
    var _a;
    const response = await pathorsApiRequest.call(this, "GET", "/v1/projects");
    const data = ((_a = response.data) !== null && _a !== void 0 ? _a : []);
    return data.map((p) => ({
        name: p.name,
        value: p.id,
    }));
}
function getProjectId(context, itemIndex) {
    const mode = context.getNodeParameter("projectSelectionMode", itemIndex !== null && itemIndex !== void 0 ? itemIndex : 0);
    return mode === "manual"
        ? context.getNodeParameter("projectIdManual", itemIndex !== null && itemIndex !== void 0 ? itemIndex : 0)
        : context.getNodeParameter("projectIdDropdown", itemIndex !== null && itemIndex !== void 0 ? itemIndex : 0);
}
