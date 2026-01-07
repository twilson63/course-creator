# Add a Webhook Trigger

Webhooks allow external services to trigger your workflow automatically. When a new call transcript is ready, the transcription service can notify ScoutOS.

## Open Webhook Settings

In your workflow:

1. Look for **Webhooks** in the left panel (or settings menu)
2. Click **Add Webhook**

## Configure the Webhook

Fill in the webhook details:

1. **Name**: Give it a descriptive name like "New Call Transcript"
2. **Input Field**: Select **message** (this is what your agent expects)
3. **Authentication**: For this demo, select **None** (in production, you'd add authentication)

## Create the Webhook

Click **Create** to generate your webhook URL.

You'll get a URL that looks like:

```
https://api.scoutagent.ai/webhooks/wh_abc123xyz
```

## Copy the Webhook URL

Click **Copy** to copy the full webhook URL to your clipboard.

> **Important:** Keep this URL secure! Anyone with this URL can trigger your workflow.

## Understanding the Flow

Here's what happens when a webhook is called:

```
External Service → Webhook URL → Workflow → Agent → Summary
```

1. **External service** (transcript provider) sends a POST request
2. **Webhook** receives the data and triggers your workflow
3. **Workflow** passes the data to your agent
4. **Agent** fetches the transcript and creates a summary
5. **Summary** is returned (can be stored, emailed, etc.)

## What's Next

Now we'll connect this webhook to the transcript simulator and test the complete end-to-end flow!
