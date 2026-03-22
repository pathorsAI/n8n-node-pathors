# n8n-nodes-pathors

This is an n8n community node for integrating with [Pathors](https://pathors.com) - an AI voice agent platform.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### Call

- **Create** - Create an outbound call from your configured phone number to a target recipient

## Credentials

To use this node, you need:

- **API Key** - Your Pathors API key

You can obtain this from your [Pathors Dashboard](https://app.pathors.com).

## Usage

1. Add the Pathors node to your workflow
2. Configure your Pathors API credentials
3. Select the resource and operation
4. Fill in the required parameters

### Create Call Example

| Parameter | Description |
|-----------|-------------|
| Project ID | Your Pathors project ID |
| From Number | Your configured phone number with active outbound SIP status (e.g., +14155551234) |
| To Number | Destination phone number in E.164 format (e.g., +14155555678) |
| Dynamic Variables | Optional JSON object for call flow personalization |

## Resources

- [Pathors Documentation](https://docs.pathors.com)
- [Pathors API Reference](https://docs.pathors.com/en/api-reference)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE)
