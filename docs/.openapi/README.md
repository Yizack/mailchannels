# OpenAPI Specification

This directory contains the OpenAPI specifications of MailChannels. These files are intended for monitoring and comparing API version changes, as MailChannels does not provide release notes.

Update the files whenever there are versions changes to the MailChannels APIs.

| API           | File               | Download                                                   |
| ------------- | -------------------|------------------------------------------------------------|
| Email API     | `email-api.yaml`   | [Download](https://docs.mailchannels.net/email-api.yaml)   |
| Inbound API   | `inbound-api.yaml` | [Download](https://docs.mailchannels.net/inbound-api.yaml) |

Source: https://docs.mailchannels.net/

## Workflows

The following GitHub Actions workflows are used to monitor and update the API versions and automatically create pull requests when new versions are detected to prepare for implementation and documentation updates:

- [`check-email-api-version`](https://github.com/Yizack/mailchannels/actions/workflows/check-email-api-version.yml) (Runs every 4 hours)
- [`check-inbound-api-version`](https://github.com/Yizack/mailchannels/actions/workflows/check-inbound-api-version.yml) (Runs every day at midnight)
